<template>
  <div>
    <div v-if="user" class="content">
        <router-link class="is-size-1" to="/" id="fixedbutton">Home</router-link>
        <div style="width: 50%; margin: auto;">
          <article class="media">
            <div class="media-left">
              <figure class="image" style="width: 55%; margin: auto;">
                <img :src=user.avatar_url class="is-rounded">
              </figure>
              <div v-if="user.email">
                <i class="fas fa-envelope-open"></i>
                <strong class="ml-2">Email: </strong>{{user.email}}<br>
              </div>
              <div v-if="user.company">
                <i class="fas fa-building"></i>
                <strong class="ml-2">Company: </strong>{{user.company}}<br>
              </div>
            </div>
            <div class="media-content ml-0">
              <strong><a target="_blank" :href=user.html_url  class="is-size-1">{{user.login}}</a></strong><br>
              <p class="subtitle">{{user.name}}</p>
              <div class="columns">

                <div class="columns column is-four-fifths">
                  <div class="column is-full">
                    <h2>Basic info</h2>
                    <i class="fas fa-users"></i>
                    <strong class="ml-1">Type: </strong>{{user.type}} <br>
                    <i class="fas fa-map-marker-alt"></i>
                    <strong class="ml-1">Location: </strong>{{user.location}} <br>
                    <i class="fas fa-code-branch"></i>
                    <strong class="ml-1">Repositories: </strong>{{reposCount}}<br>
                    <i class="fas fa-star"></i>
                    <strong class="ml-1">Followers: </strong>{{user.followers}} <br>
                    <i class="far fa-star"></i>
                    <strong class="ml-1">Following: </strong>{{user.following}} <br>
                  </div>
                </div>

                <div class="column is-half">
                  <h2>Organizations</h2>
                  <div v-if="organizations">
                    <div class="p-0"  v-for="organization in organizations" :key="organization.login">
                      <figure class="image columns mt-4" style="width: 15%; margin-right:1px;">
                        <img :src=organization.avatar_url style="vertical-align:middle;" class="is-rounded">
                        <strong style="font-size: 15px;"><a target="_blank" :href="'https://www.github.com/'+organization.login">{{organization.login}}</a></strong><br>
                      </figure>
                    </div>
                  </div>
                  <div v-else>
                    <p>No organizations</p>
                  </div>
                </div>

              </div>
            </div>
          </article>
        </div>
        <br>
        <div v-if="repos">
          <h3>Top repositories</h3>
          <div v-for="repo in repos" :key="repo.id" class="is-size-4">
            <div class="box" style="width: 50%; margin: auto;">
              <article class="media">
                <div class="media-content repo">
                  <div class="content">
                    <h1 style="display:inline-block;">{{repo.name}}</h1>
                    <span class="icon has-text-dark ml-2" style="vertical-align: super;">
                      <a :href=repo.svn_url><i class="fab fa-github"></i></a>
                    </span><br>
                      <i class="fas fa-code"></i>
                      <strong class="ml-1">Language: </strong>{{repo.language}} <br>
                      <i class="fas fa-code-branch"></i>
                      <strong class="ml-1">Forks: </strong>{{repo.forks}} <br>
                      <i class="fas fa-exclamation-triangle"></i>
                      <strong class="ml-1">Issues: </strong>{{repo.open_issues}} <br>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
        <div v-else>
          <h1>No repositories</h1>
        </div>
    </div>
    <div v-else>
      <div>
        <h1 class="is-size-1">User <strong>{{$route.params.username}}</strong> not found!</h1> <br>
      </div>
    </div>
    <router-link class="is-size-1" to="/">BACK</router-link>
  </div>
</template>

<script>
export default {
    name: 'UserInfo',
    data: function(){
      return {
        user: null,
        reposCount: 0,
        repos: null,
        organizations: null,
      }
    },
    created: function(){
      this.$axios.get('/users/' + this.$route.params.username).then((res) => {
        this.user = res.data
        this.getRepos()
        this.getOrganizations()
      }).catch((err) => {
        console.log('No user found' + err)
        this.user = null
      })
    },

    methods: {
      getRepos(){
        this.$axios.get(this.user.repos_url).then((res) => {
          const repos = res.data
          this.repos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0,3)
          this.reposCount = repos.length
          console.log(repos)
          if(repos.length < 1) this.repos = null
        }).catch((err) => {
          console.log(err)
        })
      },

      getOrganizations(){
        this.$axios.get(this.user.organizations_url).then((res) => {
          this.organizations = res.data.slice(0,3)
          if(res.data.length <1) this.organizations = null
        }).catch((err) => {
          console.log(err)
        })
      }
    }

}
</script>

<style lang="css">
#fixedbutton {
    position: fixed;
    top: 3px;
    left: 3px; 
}
.repo{
  border-color: gray;
  border-bottom: solid;
  border-width: 2px;
  margin-bottom: 2px;
}
</style>