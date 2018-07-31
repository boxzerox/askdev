import React from "react";
import injectSheet from "react-jss";

import PropTypes from "prop-types";
import { injectNOS, nosProps } from "@nosplatform/api-functions/lib/react";
import axios from 'axios';

import { Input, Form, TextArea, Popup, Button, Dropdown, Card, Icon,Container, Table, Label, Divider, Grid, Header, Image, Segment, Menu } from 'semantic-ui-react'


const styles = {
  button: {
    margin: "16px",
    fontSize: "14px"
  },
  list : {

    margin : "10px"

  }
};

const neo = "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
const gas = "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";

class Directory extends React.Component {

  constructor() {
    super();
    this.state = {
        entries: [],
        address:""

      };
    this.loadEntries =  this.loadEntries.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.loadAddress = this.loadAddress.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
   

  } 

  handleSend = async ( person, amount, question ) => {

    const send = {  asset: gas, receiver: person.address, amount };

    

    await this.props.nos.send(send)
        .then((txId) => {  

          this.sendMessage(person, question);

          alert(`${amount} ${asset} sent: ${txId} and your question is posted.`)}
        )
        .catch((err) => alert(`Error: ${err.message}`));

  };


  sendMessage(person, question) {


    let message = {
        'expertName':person.name,
        'address': this.state.address,
        'expertAddress': person.address,
        'question' : question
    };


    fetch('https://peaceful-earth-27320.herokuapp.com/api/messages', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
      
        body: JSON.stringify(message),
      })
      .then(response => {
          console.log(response);

      })

  }

  loadAddress = async () =>  { 
    this.setState( {'address' :await this.props.nos.getAddress()});
  };


  loadEntries () {

    fetch("https://boxzerox.github.io/dist-askdev/devs.json")
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result);
            this.setState({

              entries: result.data
            });
          },
          (error) => {
           
          }
        )

  }

  componentDidMount() {

    this.loadAddress();

    this.loadEntries();

  }  

  render() {

    return (

         <div>

          <Entries entries={this.state.entries} 
                   handleSend={this.handleSend}
                   sendMessage={this.sendMessage} /> 

        </div>  
     
    );
  }
}

class Entries extends React.Component {


  constructor() {
    super();
    this.state = {
        question: "",
        name: "",
        attributes: "",
        description: "",
        address: ""
      };

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)  
   

  } 


  handleChange = (e, { name, value }) =>  {

    this.setState({ [name]:   value })

  }  


  handleSubmit = (person) => {

    console.log(person);
    const { name, email } = this.state

    this.props.handleSend(person, 0.1, this.state.question);

  }



  render() {

    return (

      <Card.Group centered>

         {this.props.entries.map((person, index) => {
                    return (         
              

          <Card>
            <Card.Content>
              <Card.Header>{person.name}</Card.Header>
              <Card.Meta>{person.attributes}</Card.Meta>
              <Card.Description>
                {person.description} <br/>

                <br />

                <Popup trigger={<Button>Ask</Button>} flowing hoverable>
                    <Grid centered divided columns={1}>
                      <Grid.Column textAlign='center'>
                        <Header as='h4'>Ask your Question</Header>
                        <p>
                          <b>Fee :</b>  0.1 Gas 
                        </p>
                        <Form onSubmit={()=>this.handleSubmit(person)}>
                         <input type="hidden" name="address" value={person.address}/>
                          <TextArea placeholder='Write here' name="question" style={{ minHeight: 100 }}
                          onChange={this.handleChange} />
                        <p>
                          <Button>Submit</Button>
                        </p>  

                      </Form>
                        
                      </Grid.Column>
                  
                    </Grid>
                  </Popup>
                                  
                </Card.Description>
            </Card.Content>
          </Card>

        )
        })}

      


</Card.Group>

    );


  }
}

  
  const Home = () => (
    <div>
   </div>
  );
  
  const About = () => (
    <div>
      <h2>About</h2>
    </div>
  );

Directory.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  nos: nosProps.isRequired
};

export default injectNOS(injectSheet(styles)(Directory));
