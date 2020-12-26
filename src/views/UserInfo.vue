<template>
  <div>
    <div v-if="user" class="content">
        <div class="box" style="width: 50%; margin: auto;">
          <article class="media">
            <div class="media-left">
              <figure class="image" style="width: 55%; margin: auto;">
                <img :src=user.avatar_url class="is-rounded">
              </figure>
            </div>
            <div class="media-content ml-0">
              <strong><a target="_blank" :href=user.html_url  class="is-size-1">{{user.login}}</a></strong><br>
              <p class="subtitle">{{user.name}}</p>
              <div class="columns">

                <div class="column">
                  <h2>User info</h2>
                  <strong>Type: </strong>{{user.type}} <br>
                  <strong>repositories: </strong>{{reposCount}}<br>
                  <strong>Followers: </strong>{{user.followers}} <br>
                  <strong>Following: </strong>{{user.following}} <br>
                </div>

                <div class="column">
                  <h2>Organizations</h2>
                  <div v-if="organizations">
                    <div class="p-0"  v-for="organization in organizations" :key="organization.login">
                      <figure class="image" style="width: 15%; margin-right:1px; display:inline-block;">
                        <img :src=organization.avatar_url style="vertical-align:middle;" class="is-rounded">
                      </figure>
                      <strong style="font-size: 15px;"><a target="_blank" :href=organization.html_url>{{organization.login}}</a></strong><br>
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
                <div class="media-content">
                  <div class="content">
                    <strong>{{repo.name}}</strong>
                    <span class="icon has-text-dark ml-2">
                      <a :href=repo.svn_url><i class="fab fa-github"></i></a>
                    </span><br>
                    {{repo.forks}}
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
    <router-link class="is-size-1" to="/">Home</router-link>
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
        console.log(this.user)
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
          if(repos.length < 1) this.repos = null
        }).catch((err) => {
          console.log(err)
        })
      },

      getOrganizations(){
        this.$axios.get(this.user.organizations_url).then((res) => {
          this.organizations = res.data
          if(res.data.length <1) this.organizations = null
        }).catch((err) => {
          console.log(err)
        })
      }
    }

}
</script>
