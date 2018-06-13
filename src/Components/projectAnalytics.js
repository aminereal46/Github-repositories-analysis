import React, { Component } from 'react';
import Committers from './Committers';
import '../App.css';

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {title :'',
                  projects:[],
                  committersMap :{},
                  committersWithLastCommits:{},
                  committers:[],
                  menu:''
                };
  }
  componentWillReceiveProps(newProps){
    let commits = [];
    this.setState({
      committersMap :{},
      committersWithLastCommits:{},
      committers:[],
      loading:'',
      menu:''
    });
    if(newProps.user === '' && newProps.repo === ''){
      return;
    }
    fetch("https://api.github.com/repos/"+newProps.user+'/'+newProps.repo+'/branches')
     .then(response => response.json())
     .then(async json => {
       if((!json || !json[0] || !json[0].commit) && json.message){
         this.setState({
           loading:json.message.split('(')[0]+'(GitHUB api)'
         });
         return;
       }
       this.setState({
         loading:'loading from github api ...'
       });
       for(let branchIdx = 0; branchIdx < json.length; branchIdx++){
         let sha = json[branchIdx].commit.sha;
         let all = false;
         do{
           console.log('sha',sha);
           console.log('url','https://api.github.com/repos/'+newProps.user+'/'+newProps.repo+'/commits?per_page=100&sha='+sha);
         var response = await fetch('https://api.github.com/repos/'+newProps.user+'/'+newProps.repo+'/commits?per_page=100&sha='+sha);
         var result = await response.json();
         if((!result || !result[0] || !result[0].sha)){
           let message = 'GitHUB api problem';
           if(json.message){
             message = json.message;
           }
           this.setState({
             loading:json.message
           });
           return;
         }
            sha = result[result.length-1].sha;
            if(result.length < 100){
              all = true;
              commits = commits.concat(result);
            }else {
              commits = commits.concat(result.slice(0,result.length-1));
            }
            console.log('all',all);
        } while (!all)
       }
       console.log('commits:'+commits.length);
       commits.sort((a,b)=>
          new Date(a.commit.date) - new Date(b.commit.date)
        );
        this.setState({
          loading : '',
          menu : <div>
          <button >
                Committers
              </button>
              <button >
                Commits
              </button>
              </div>
        });

       console.log('count####',json.length,' ',json);
       let a = 0;

       commits.map(commit =>{
         a++;
         let user = commit.commit.committer.name;
         if(!this.state.committersMap[user]){
             this.state.committersMap[user]= 0;
         }
         console.log('ccc');
           this.state.committersMap[user] = this.state.committersMap[user]+1;
       });
       commits.slice(0,100).map(commit =>{
         let user = commit.commit.committer.name;
         if(!this.state.committersWithLastCommits[user]){

             this.state.committersWithLastCommits[user] = 0;
         }

           this.state.committersWithLastCommits[user] = this.state.committersWithLastCommits[user]+1;
       });

       this.setState({
         allCommitters : Object.keys(this.state.committersMap).map(key => {
           let commitsNbr = this.state.committersMap[key];
           return (
           <div key={key}>
             {key}({commitsNbr})
           </div>);
         }),
         committers : Object.keys(this.state.committersWithLastCommits).map(key => {
           let commitsNbr = this.state.committersWithLastCommits[key];
           return (
           <div key={key}>
             {key}({commitsNbr})
           </div>);
         })
     });
   });
  }
  render() {
    return (
    <div>
      {this.state.menu}
      {this.state.loading}
      {this.state.allCommitters}
      ###########################################
      {this.state.committers}
    </div>

    );
  }
}

export default Project;
