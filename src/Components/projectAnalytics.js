import React, { Component } from 'react';
import BarChart from 'react-bar-chart';
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
                  menu:'',
                  data:[]
                };
  }
  componentWillReceiveProps(newProps){
    let commits = [];
    this.setState({
      committersMap :{},
      committersWithLastCommits:{},
      committers:[],
      loading:'',
      menu:'',
      xlabel : '',
      ylabel :'',
      margin:{},
      commitsHistogram :''
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
       this.setState({
         loading:''
       });
       commits.sort((a,b)=>
          new Date(a.commit.date) - new Date(b.commit.date)
        );
       console.log('count####',json.length,' ',json);
       let a = 0;
       let coms = [];
       let committers = {};
       commits.map(commit =>{
         a++;
         let com = commit.commit.committer.name;

         committers[com]=1;
       });
       commits.slice(0,100).map(commit =>{
         let user = commit.commit.committer.name;
         let com = {
              message : commit.commit.message,
              commiter : user,
              date : commit.commit.committer.date
            };

         coms.push(com);
         if(!this.state.committersWithLastCommits[user]){

             this.state.committersWithLastCommits[user] = 0;
         }

           this.state.committersWithLastCommits[user] = this.state.committersWithLastCommits[user]+1;
       });
       let data = [];
       Object.keys(this.state.committersWithLastCommits).map( key => {
         let obj = {
           text : key,
          value :  this.state.committersWithLastCommits[key]
        };
         data.push(obj);
       }
     );
     const margin = {top: 20, right: 20, bottom: 30, left: 40};
     this.setState({
       commitsHistogram : <BarChart ylabel='commits'
       xlabel = 'Committers'
           width={1500}
           height={500}
           margin={margin}
           data={data}/>
     });


       this.setState({
         allCommitters : Object.keys(committers).map(committer => {
           return (
           <div key={committer}>
             {committer}
           </div>);
         }),
         commits : coms.map(com => {
           return (
           <div key={com.commiter+com.date}>
             <div>{com.message}</div>
             {com.commiter}   commited on {com.date.split('T')[0]} <br/><br/>
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

  showCommitters(){


  }

  render() {

    return (
    <div>

      {this.state.loading}
      <div className='commits'>
        {this.state.allCommitters}
      </div>

        <div className='commits'>
          {this.state.commitsHistogram}
        </div>

        <div className='commits'>
          {this.state.commits}
        </div>
    </div>

    );
  }
}

export default Project;
