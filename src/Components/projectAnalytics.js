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
                  committers:[]};
  }
  componentWillReceiveProps(newProps){
    this.setState({
      committersMap :{},
      committersWithLastCommits:{},
      committers:[]
    });
    if(newProps.user === '' && newProps.repo === ''){
      return;
    }
    console.log('new',newProps);
    console.log('url:',"https://api.github.com/repos/"+newProps.user+'/'+newProps.repo+'/commits');
    fetch("https://api.github.com/repos/"+newProps.user+'/'+newProps.repo+'/commits')
     .then(response => response.json())
     .then(json => {
       console.log('count####',json.length,' ',json);
       let a = 0;
       json.map(commit =>{
         a++;
         let user = commit.commit.committer.name;
         if(!this.state.committersMap[user]){
             this.state.committersMap[user]= 0;
         }
         console.log('ccc');
           this.state.committersMap[user] = this.state.committersMap[user]+1;
       });
       console.log('nbr:',a);
       console.log('mapcomm',this.state.committersMap);
       console.log(json.slice(0,100));
       console.log('count####',json.slice(0,100).length,' ',json);
       json.slice(0,100).map(commit =>{
         let user = commit.commit.committer.name;
         if(!this.state.committersWithLastCommits[user]){

             this.state.committersWithLastCommits[user] = 0;
         }

           this.state.committersWithLastCommits[user] = this.state.committersWithLastCommits[user]+1;
       });

       this.setState({
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
      {this.state.committers}
    </div>

    );
  }
}

export default Project;
