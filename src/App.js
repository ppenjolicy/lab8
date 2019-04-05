import React, {Component} from 'react';
import firebase from 'firebase';

class App extends Component {

   constructor(props) {
       super(props)
       this.state = {
           tasks:
               [   {id: 1, name: 'Running at J',age: 20},
                   {id: 2, name: 'Write React program',age:20}
               ]
           ,
           task:'' ,
           age:''
       }

       let config = {
           apiKey: "AIzaSyD7-TaJ-hR9NndXEn8NMf2lUHd43yXXuLQ",
           authDomain: "todo-22bab.firebaseapp.com",
           databaseURL: "https://todo-22bab.firebaseio.com",
           projectId: "todo-22bab",
           storageBucket: "todo-22bab.appspot.com",
           messagingSenderId: "607775642969"
       };

       if (firebase.apps.length === 0) firebase.initializeApp(config)

       console.log('firebase: ', firebase.database())
       console.log('firebase: ', firebase.app().name)
       console.log('firebase: ', firebase.app().age)

       let myapp = firebase.database().ref('/');
       let tasksChild = myapp.child('/taskTable')
       tasksChild.remove()
       tasksChild.set({tasks: this.state.tasks})
       myapp.on('value', snapshot => {
           console.log('task0: ', snapshot.val())
       });
   }

   removeTask = (id) => {
       let array = [...this.state.tasks]; // make a separate copy of the array
       let index = array.findIndex((task) => task.id === id)
       array.splice(index, 1)
       this.setState({tasks: array})
       console.log('update states tasks:', this.state.tasks)

       let tasksChild = firebase.database()
           .ref('/')
           .child('/taskTable/tasks/' + (id - 1))
       tasksChild.remove()
           .then(() => console.log("Remove success: "))
           .catch((err) => console.log("Remove failed: " + err))
   }

   addTask = () => {
       let lastItem = this.state.tasks[this.state.tasks.length - 1]
       let newTask = {id: lastItem.id + 1, name: this.state.task, age: this.state.age}
       this.setState({
           tasks: [...this.state.tasks, newTask]
       })
console.log(this.state.tasks)
       let tasksChild = firebase.database()
           .ref('/')
           .child('/taskTable/tasks/' + lastItem.id)
       tasksChild.set(newTask)
           .then(() => console.log("Add successfully: "))
           .catch((err) => console.log("Remove failed: " + err))
   }

   editTask = (id) => {
       let index = this.state.tasks.findIndex((task) => task.id === id)
       this.setState({task: this.state.tasks[index].name,age: this.state.tasks[index].age})
   }

   updateTask = (id) => {
       console.log('update states tasks:', this.state.tasks)
       let array = [...this.state.tasks]
       let index = array.findIndex((task) => task.id === id)
       array[index].name = this.state.task
       array[index].age = this.state.age
       this.setState({tasks: array})

       let tasksChild = firebase.database()
           .ref('/')
           .child('/taskTable/tasks/' + (id - 1))
       tasksChild.set({id: array[index].id, name: this.state.task,age: this.state.age})
           .then(() => console.log("Update successfully: "))
           .catch((err) => console.log("Update failed: " + err))
   }

   handleChange = (e) => this.setState({[e.target.name]: e.target.value})

   renderTasks = () => {
       if (this.state.tasks.length !== 0)
           return this.state.tasks.map((task, index) => {
               return (
                   <tr key={index}>
                       <td>{task.id}</td>
                       <td> {task.name}</td>
                       <td> {task.age}</td>
                       <td>
                           <button onClick={() => this.editTask(task.id)}> Get</button>
                       </td>
                       <td>
                           <button onClick={() => this.updateTask(task.id)}> Update</button>
                       </td>
                       <td>
                           <button onClick={() => this.removeTask(task.id)}> Delete</button>
                       </td>
                   </tr>)
           })
   }

   render() {
       return (
           <div style={{margin: '40px'}}>
               <h2>Name List: </h2>
               <input type="text" name="task" onChange={this.handleChange}/>
               <input type="text" name="age" onChange={this.handleChange}/>
               <button onClick={this.addTask}>Add</button>
               <br/><br/>
               <table>
                   <thead>
                   <tr>
                       <th>ID</th>
                       <th>Task</th>
                       <th>Age</th>
                       <th colSpan={3}>Action</th>
                   </tr>
                   </thead>
                   <tbody>
                   {this.renderTasks()}
                   </tbody>
               </table>
           </div>
       );
   }
}

export default App;
