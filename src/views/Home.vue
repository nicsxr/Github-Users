<template>
  <div class="home" v-on:click="changeSearchFocus($event)">
    <div class="container" style="width:40%; margin:auto;">
      <form autocomplete="off" class="is-flex is-align-content-center" @submit.prevent="searchUser">
        <input id="searchInput" @focus="changeSearchFocus($event)" class="input is-success" v-model="searchWord" type="text" placeholder="Search users">
        <button class="button is-success searchButton" type="submit">Search</button>
      </form>
        <div class="tile search-box" v-if="searchFocus">
          <article class="tile is-child notification is-success is-10">
            <h1 class="title">Last searches <i class="fas fa-search"></i></h1>
            <div v-for="search in searches" :key="search.login" class="columns">
              <div v-if="search.found == 1" class="is-flex is-align-content-center">
                <figure class="image is-32x32 mr-3">
                  <img class="is-rounded " :src="search.avatar_url">
                </figure>
                <a :href="'/'+search.login"><p class="subtitle">{{search.login}}</p></a>
                <span class="icon has-text-dark">
                    <a :href=search.git_url><i class="fab fa-github ml-3 vertical-middle"></i></a>
                </span> 
                <hr>
              </div>
              <div v-if="search.found == 0" class="is-flex is-align-content-center">
                <figure class="image is-32x32 mr-3">
                  <i class="far fa-2x fa-question-circle"></i>
                </figure>
                <a :href="'/'+search.login"><p class="subtitle">{{search.login}}</p></a>
                <hr>
              </div>
            </div>
          </article>
        </div>
    </div>
    <br>
    <div class="grid-list-toggle">
      <button v-on:click="toggleView(0)" class="btn" :class="{active: gridView==false}"><i class="fa fa-bars"></i> List</button>
      <button v-on:click="toggleView(1)" class="btn" :class="{active: gridView==true}"><i class="fa fa-th-large"></i> Grid</button>
    </div>

    <!-- LIST VIEW !-->
    <div class="usersDiv" v-if="gridView==false">
      <div v-for="user in users" :key="user.login" class="user-list">
        <article class="columns">
          <figure class="column media-left">
            <img :src=user.avatar_url width="250px" height="200px">
          </figure>
          <div class="column media-content">
            <div class="content">
                <strong><a :href="'/'+ user.login" class="is-size-1">{{user.login}}</a></strong><br>
                <strong>Type: </strong>{{user.type}}
                <div v-if="user.repos">
                  <h3>Top 3 repositories</h3>
                  <div v-for="repo in user.repos" :key="repo.id">
                    <p class="repo-name">{{repo.name}}</p>
                    <span class="icon has-text-dark">
                      <a :href=repo.svn_url><i class="fab fa-github vertical-middle"></i></a>
                    </span>
                  </div>
                </div>
                <div v-else>
                  <h1>No repositories</h1>
                </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- GRID VIEW !-->
    <div class="usersDiv columns is-multiline" v-if="gridView==true">
      <div v-for="user in users" :key="user.login" class="column is-one-quarter">
        <div class="card">
          <div class="card-image">
            <figure class="is-1by1">
              <img :src=user.avatar_url width="300px" height="100px">
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <strong><a :href="'/'+user.login" class="is-size-1">{{user.login}}</a></strong><br>
                <strong>Type: </strong>{{user.type}}
              </div>
            </div>
            <div v-if="user.repos" class="content">
              <h3>Top 3 repositories</h3>
              <div v-for="repo in user.repos" :key="repo.id">
                {{repo.name}}
                <span class="icon has-text-dark">
                  <a :href=repo.svn_url><i class="fab fa-github vertical-middle"></i></a>
                </span>
              </div>
            </div>
            <div v-else>
              <h1>No repositories</h1>
            </div>
            
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  data: function (){
    return{
      users: [],
      searchWord: '',
      gridView: false,
      searchFocus: false,
      searches: []
    }
  },

  mounted: function (){
    console.log(process.env.GIT_TOKEN)
    this.getTopUsers()
    if(localStorage.gridView==1) this.toggleView(1)

    if(!localStorage.searches){
      localStorage.searches = JSON.stringify(new Array())
    } 
    else{      
      // LOCALSTORAGE NEEDS WORK!!!!!!
      this.searches = JSON.parse(localStorage.searches)

    }
  },
  methods: {
    getTopUsers: function(){
      this.$axios.get('/search/users', {
        params: {
          'q': 'followers:>10000 ',
          'sort': 'followers-desc',
          //'page': 1,
          //'per_page': ''
        }
      }).then((res) => {
        var users = res.data.items.slice(0,30)
        users = users.sort((a, b) => b.followers - a.followers)

        // add top 3 repos for each user
        users.forEach(user => {
          this.$axios.get(user.repos_url).then((res) => {
            const repos = res.data
            if(repos.length < 1) user['repos'] = null
            else user['repos'] = repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0,3)
            //console.log(user.repos)
            this.users.push(user)
          }).catch((err) => {
            console.log(err)
          })
        });
      }).catch((err) => {
        console.log(err)
      })
      console.log(this.users)
    },

    searchUser: function(){
      if (this.searchWord == '') return

      this.$axios.get('/users/' + this.searchWord).then((res) => {
        console.log(res)
        this.$router.replace({path:'/'+this.searchWord})

        var oldSearches = JSON.parse(localStorage.searches)
        console.log(oldSearches)
        oldSearches.splice(0,0, {
          found: 1,
          login: res.data.login,
          git_url: res.data.html_url,
          avatar_url: res.data.avatar_url
        })
        localStorage.searches = JSON.stringify(oldSearches.slice(0,3))

        
      }).catch((err) => {
        this.$router.replace({path:'/'+this.searchWord})

        var oldSearches = JSON.parse(localStorage.searches)
        console.log(oldSearches)
        oldSearches.splice(0,0, {
          found: 0,
          login: this.searchWord,
        })
        localStorage.searches = JSON.stringify(oldSearches.slice(0,3))

        console.log('No user found' + err)
      })
    },

    toggleView: function(view){
      console.log('hehe')
      if(view == 0){
        localStorage.gridView = 0
        this.gridView = false
      } 
      else {
        localStorage.gridView = 1
        this.gridView = true
      }
    },

    changeSearchFocus: function(event){
      console.log(event.target.id)
      if(event.target.id == 'searchInput'){
        this.searchFocus = true
        return  
      }  
      this.searchFocus = false
    }
  },
}
</script>

<style lang="css">
.searchButton{
  width: 20%;
}
.usersDiv{
  padding: 2rem;
}
.user-list{
  margin: auto;
  width: 50%;
  border-color: gray;
  border-bottom: solid;
  border-width: 2px;
  margin-bottom: 2px;
}

.repo-name{
  display: inline-block;
}

.grid-list-toggle{
  display: flex;
  margin-left: 47%;
}

.btn{
  border: none;
  outline: none;
  padding: 12px 16px;
  background-color: #f1f1f1;
  cursor: pointer;
}
.btn:hover {
  background-color: #ddd;
}
.btn.active {
  background-color: #666;
  color: white;
}

.search-box{
  margin-left: auto;
  position: absolute;
  width: 100%;
  opacity: 98%;
  visibility: show;
  z-index: 99;
}

.vertical-middle{
  vertical-align:middle;
}
</style>