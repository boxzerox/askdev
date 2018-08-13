import React from "react";
import ReactDOM from 'react-dom';
import injectSheet from "react-jss";

import PropTypes from "prop-types";
import { injectNOS, nosProps } from "@nosplatform/api-functions/lib/react";
import axios from 'axios';

import { List, Input, Form, TextArea, Popup, Button, Dropdown, Card, Icon,Container, Table, Message, Label, Divider, Grid, Header, Image, Segment, Menu } from 'semantic-ui-react'


const styles = {
  button: {
    margin: "16px",
    fontSize: "14px"
  },
  list : {

    margin : "10px"

  },
  intro: {
    fontSize: "large"
  },
  lineBreak: {
    width: "75%",
    borderTop: "1px solid #333333",
    margin: "32px auto"
  }

};

const neo = "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
const gas = "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";

class Directory extends React.Component {

  constructor() {
    super();
    this.state = {
        entries: [],
        address:"",
        questions: []

      };
    this.loadEntries =  this.loadEntries.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.loadAddress = this.loadAddress.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.mountMenuContent = this.mountMenuContent.bind(this);
   
  } 

  handleSend = async ( person, amount, question ) => {

    const send = {  asset: gas, receiver: person.address, amount };

    // this.sendMessage(person, question);


    await this.props.nos.send(send)
        .then((txId) => {  

          this.sendMessage(person, question);

          this.loadQuestions();

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
    this.loadQuestions();

  };


  loadEntries () {


    fetch("https://peaceful-earth-27320.herokuapp.com/api/developers")
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result);
            this.setState({

              entries: result
            });
          },
          (error) => {
           
          }
        )

  }


  loadQuestions () {

    console.log('Loading questions....');

    fetch("https://peaceful-earth-27320.herokuapp.com/api/messages?address="+this.state.address)
        .then(res => res.json())
        .then(
          (result) => {

            console.log('loading questions..');
            console.log(result);
            this.setState({

              questions: result
            });
          },
          (error) => {
           
          }
        )

  }

  componentDidMount() {

    this.loadAddress();

    this.loadEntries();

    console.log("Entries mount.");


   // this.mountMenuContent('directory');

  }  




  mountMenuContent(name) {


    console.log(this.state.entries);
    console.log('render directory');

    if(name == 'directory') {

      ReactDOM.render(<Entries entries={this.state.entries}  handleSend={this.handleSend} sendMessage={this.sendMessage} />
        , document.getElementById('content'));

        this.loadAddress();

       // ReactDOM.unmountComponentAtNode()


      }else if (name == 'questions') {

        this.loadQuestions();


        ReactDOM.render(<Questions questions={this.state.questions} />, document.getElementById('content'));

      }else if(name == 'developers') {

        console.log('render developer area..');    
        ReactDOM.render(<DeveloperArea address={this.state.address} loadEntries={this.loadEntries}/>, document.getElementById('content'));
      }



    
  }



  render() {

    return (

         <div>

         <MenuBar mountMenuContent={this.mountMenuContent} />

         <div id="content">

            <Entries entries={this.state.entries}  handleSend={this.handleSend} sendMessage={this.sendMessage} />
         
         </div>


        </div>  
     
    );
  }
}


class MenuBar extends React.Component {
  state = {}

  handleItemClick = (e, { name }) => { 
    
    this.setState({ activeItem: name });
    this.props.mountMenuContent(name);
  
  }

  render() {
    const { activeItem } = this.state

    return (
      <Menu>

        <Menu.Item
          name='home'
        
          onClick={this.handleItemClick}
        >

    <Image src='logo.png' size='small' avatar />
          
        </Menu.Item>


        <Menu.Item
          name='directory'
          active={activeItem === 'directory'}
          onClick={this.handleItemClick}
        >

          Directory
        </Menu.Item>

        <Menu.Item name='questions' active={activeItem === 'item2'} onClick={this.handleItemClick}>
          Questions/Answers
        </Menu.Item>

        <Menu.Item
          name='developers'
          active={activeItem === 'developers'}
          onClick={this.handleItemClick}
        >
          Developer Area
        </Menu.Item>
      </Menu>
    )
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

      <div>

          <div>

          <Message>
           <Message.Header> AskDEV is a directory of nOS devs who would like to anwser your questions
           </Message.Header>
            <p>
            Pay a small fee in GAS for questions
            </p>
          </Message>  


          </div>

      <Divider horizontal>Developers</Divider>


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

    </div>

    );


  }
}

class Questions extends React.Component {


  constructor() {
    super();
    this.state = {
        questions: [],

      };
   
  } 


  render() {

    return (
      
      <div>

          <div>

           <Message>
           <Message.Header> Your Questions and Developer answers are listing here
           </Message.Header>
            <p>
            </p>
          </Message>     
          </div>


      <Divider horizontal>Your Questions & Answers</Divider>

        <Container textAlign='left'>

          {this.props.questions.map((question, index) => {
                      return (   

                        <Segment.Group>

                          <Segment color="blue">{question.expertName} -- {question.question}</Segment>

                          <Segment.Group>
                            <Segment>Answer : &nbsp;{question.answer}</Segment>
                          </Segment.Group>      

                        </Segment.Group>
         

            )
            })}           
                  

        </Container>
      </div>  


      
    );


  }


}

class DeveloperArea extends React.Component {

  constructor() {
    super();
    this.state = {
      questions: []
    };

    this.loadDeveloperQuestions = this.loadDeveloperQuestions.bind(this);
  }


  loadDeveloperQuestions() {


    fetch("https://peaceful-earth-27320.herokuapp.com/api/devmessages?address="+ this.props.address)
    .then(res => res.json())
    .then(
      (result) => {

        console.log("Load developer questions..");
        console.log(result);
        this.setState({

          questions: result

        
        });
      },
      (error) => {
       
      }
    )

  }

  componentDidMount() {

    this.loadDeveloperQuestions();
  }

  render() {

    console.log(this.props.address + '##address at developer area');

    return (

      <div>

         <div>

          <Message>
           <Message.Header>Update your details here if you are a developer.

           </Message.Header>
            <p>
            You can start recieving questions after updating here.
            </p>
          </Message>       

          </div>


        <Divider horizontal>Developer Details</Divider>


        <DeveloperForm address={this.props.address} loadEntries={this.props.loadEntries}/>
        <br />

        <DeveloperQuestions questions={this.state.questions} loadDeveloperQuestions={this.loadDeveloperQuestions}/>

      </div>
       

    )
  }

}

class DeveloperQuestions extends React.Component {
  constructor() {
    super();
    this.state = {
      answer:''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateAnswer = this.updateAnswer.bind(this);
  }


  updateAnswer = (question) => {


    console.log("Question Id : " + question._id);


    fetch('https://peaceful-earth-27320.herokuapp.com/api/messages/'+question._id, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
      
        body: JSON.stringify(question),
      })
      .then(response => {
          console.log('Response..');

          this.props.loadDeveloperQuestions();

          this.setState({submitted: true});

      })
    
  }

  handleChange = (e, { name, value }) =>  {

    console.log(name + ' ' + value);

    this.setState({ [name]:  value })

  }  

  handleSubmit = (question) => {

    console.log("Answer ++ " + this.state.answer);

    question.answer = this.state.answer;
    
    console.log(JSON.stringify(question));

    this.updateAnswer(question);


  }

  render() {

    return(

      <div>

         
        <Divider horizontal>Questions for you</Divider>

        <Container textAlign='left'>
          <List divided relaxed>


          {this.props.questions.map((item, index) => {
                    return (           

          <List.Item>
            <List.Icon name='mail' size='large' verticalAlign='middle' />
            <List.Content>
              <List.Header as='a'><br/><br/> {item.question} </List.Header>
              <List.Description as='a'>

                                        &nbsp;<br / >

              
              { (!item.answer || item.answer == '') &&  
              
              <List.Content >

              <Popup trigger={<Button>Answer</Button>} flowing hoverable>
                    <Grid centered divided columns={1}>
                      <Grid.Column textAlign='center'>
                        <Header as='h4'>Your answer</Header>
                       
                        <Form onSubmit={()=>this.handleSubmit(item)}>
                         <input type="hidden" name="address" value=""/>
                          <TextArea placeholder='Write here' name="answer" style={{ minHeight: 100 }}
                          onChange={this.handleChange} />
                        <p> 
                          <Button>Submit</Button>
                        </p>  

                      </Form>
                        
                      </Grid.Column>
                  
                    </Grid>
                  </Popup>

              </List.Content>    
              }    
              {item.answer}
              </List.Description>
            </List.Content>
          </List.Item>

            
        )
        })}


          </List>

      
         
        </Container>  


      </div>


    );
  }
}


class DeveloperForm extends React.Component {

  constructor () {
    super();
    this.state = {
       name: '',
       attributes: '',
       description: '',
       address: '',
       submitted: false

    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadDeveloper = this.loadDeveloper.bind(this);
  }

  handleChange = (e, { name, value }) =>  {

    console.log(name + ' ' + value);

    this.setState({ [name]:  value })

  }  


  handleSubmit = (developer) => {

    this.setState({'address': this.props.address});

    console.log(this.state);

    const { name, email } = this.state;

    this.handleRegistration(this.state);


  }

  handleRegistration = (developer) => {



    fetch('https://peaceful-earth-27320.herokuapp.com/api/developers', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
      
        body: JSON.stringify(developer),
      })
      .then(response => {
          console.log(response);

          this.setState({submitted: true});

          this.props.loadEntries();

      })
    
  }

  loadDeveloper() {

    console.log("Init Load developer.." +"https://peaceful-earth-27320.herokuapp.com/api/developers/"+this.props.address);


    fetch("https://peaceful-earth-27320.herokuapp.com/api/developers/"+this.props.address)
    .then(res => res.json())
    .then(
      (result) => {

        console.log("Load developer..");
        console.log(result);
        this.setState({

          name: result.name,
          skills: result.skills,
          description: result.description


        });
      },
      (error) => {
       
      }
    )

  }

  


  componentDidMount() { 

    this.setState({'address': this.props.address});
    this.loadDeveloper();
  }


  render() {

  
    return (

      <Container>
        <Form onSubmit={this.handleSubmit} className={this.state.submitted?'ui success form':''}>

        <Form.Group widths='equal'>

        <Form.Field control={Input} label='Name' name='name' placeholder='Name' value={this.state.name} onChange={this.handleChange}/>

        <Form.Field control={Input} label='Skills' name='skills' placeholder='Skills, Comma separated' value={this.state.skills}onChange={this.handleChange}/>
        
        </Form.Group>

        
        <Form.Field control={TextArea} label='Description' name='description' placeholder='Tell us more about you...' value={this.state.description} onChange={this.handleChange}/>

        <div className='ui success message'>
          <div class='content'>
            <div class='header'>You are in!</div>
            <p>You&#x27;re all signed up for the developer directory.</p>
          </div>
        </div>

        <Button type='submit'>Submit</Button>
       </Form>
      </Container>

    )   


  }

}




Directory.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  nos: nosProps.isRequired
};

export default injectNOS(injectSheet(styles)(Directory));
