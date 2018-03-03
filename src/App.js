import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { render } from "react-dom";
import { makeData, Logo, Tips } from "./Utils";
import axios from 'axios';
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      data1: [{
        date: '',
        inputText: '',
        intent: '',
        intentconf: '',
        outputText: '' 
      }],
      data: makeData()
    };
    
  }

  //console.log("data: =", data)

  
  componentDidMount () {
      
    axios.get('https://cc9926f6-c324-44c2-bf9c-fd7d5878085b-bluemix.cloudant.com/hs-bcw2018-ebike/_all_docs?include_docs=true',
    
    { auth: {
        username: "<username>",
        password: "<password>"}})
        .then( response => {
            //console.log("https response", response);
            console.log("try to access record= ", response.data.rows[2].doc.input.text);
            console.log("try to access record= ", response.data.rows[2].doc.output.text);
            console.log("try to access record= ", response.data.rows[0].doc.intents[0].intent);
            console.log("try to access record= ", response.data.rows[0].doc.intents[0].confidence);
            console.log("try to access record= ", response.data.rows[0].doc.date);
            const respJson = [];
            let tempconf = 0;
            let tempintent = "";
            let tempdiscresult = "";
            let tempdiscconf = "";
            for(var i=0, len=response.data.rows.length; i<len; i++)
            {
              if (response.data.rows[i].doc.intents.length ==0) {
                tempconf = 0;
                tempintent = 'not assigned';
              } else {
                if(response.data.rows[i].doc.intents[0].hasOwnProperty('intent')) {
                  tempconf = response.data.rows[i].doc.intents[0].confidence;
                  tempintent = response.data.rows[i].doc.intents[0].intent;
                }
                else {
                  tempconf = 0;
                  tempintent = 'not assigned';
                }
              }
              if(response.data.rows[i].doc.output.hasOwnProperty('discoveryResults')) {
                tempdiscresult = response.data.rows[i].doc.output.discoveryResults[0].title;
                tempdiscconf = response.data.rows[i].doc.output.discoveryResults[0].confidence;
              } else {
                tempdiscresult = '-';
                tempdiscconf = '-';
              }
              respJson[i] = {
                date: response.data.rows[i].doc.date,
                inputText: response.data.rows[i].doc.input.text,
                intent: tempintent,
                intentconf: tempconf,
                outputText: response.data.rows[i].doc.output.text,
                discoveryText: tempdiscresult,
                discoveryConf: tempdiscconf
              }
            }
            console.log('respJson =', respJson);
          
            this.setState({data1: respJson} );
            //this.setState({post: updatedPosts});
            //console.log( response );
        } );
  }

postSelectedHandler = (id) => {
    this.setState({selectedPostId: id});
}



  render() {
    const { data1 } = this.state;
    console.log('data', data1);
    return (
      <div>
        <ReactTable
          data={data1}
          columns={[
            {
              Header: "Input",
              columns: [
                {
                  width:'180',
                  Header: "Date",
                  accessor: "date"
                },
                {
                  width:'200',
                  resizable: true,
                  Header: "InputText",
                  //id: "inputText",
                  accessor: 'inputText'
                }
              ]
            },
            {
              Header: "Info",
              columns: [
                {
                  width: '100',
                 resizable: true,
                  Header: "Intent",
                  accessor: "intent"
                },
                {
                  width:'100',
                  resizable: true,
                  Header: "Conf",
                  accessor: "intentconf"
                }
              ]
            },
            {
              Header: 'Output',
              columns: [
                {
                  width:'300',
                  resizable: true,
                  Header: "OutputText",
                  accessor: "outputText"
                },
                {
                  width:'300',
                  resizable: true,
                  Header: "DiscoveryText-Title",
                  accessor: "discoveryText"
                },
                {
                  width:'100',
                  resizable: true,
                  Header: "DiscoveryConf",
                  accessor: "discoveryConf"
                }
              ]
            }
          ]}
          defaultPageSize={20}
          className="-striped -highlight"
        />
       
      </div>
    );
  
  }
}

export default App;
