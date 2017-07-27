import React, { Component } from 'react';
import './App.css';

const presidents = require('./presidents.json');

class GuessPresidentApp extends Component {
	constructor() {
		super();
		this.state = {
			id: Math.floor(Math.random() * presidents.length),
			status: ""
		}
	}

	next() {
		let newId = Math.floor(Math.random() * presidents.length);

		while (newId === this.state.id) {
			newId = Math.floor(Math.random() * presidents.length);
		}

		this.setState({ id: newId });
	}

	onEnter(e) {
		let pres = presidents[this.state.id];
		let self = this;
		if (e.key === "Enter") {
			let correct = false;
			if (e.target.value === pres.name ||
				e.target.value.toLowerCase() === pres.name.toLowerCase()) {
				this.setState({status: "Nice job! That was correct!"});
				correct = true;
			} else {
				this.setState({status: "Sorry, that was wrong. Are you even American?"});
			}
			setTimeout(function() {
				self.setState({status: ""});
				if (correct) {
					self.next();
				}
			}, 2000);
		}
	}

	answer() {
		this.setState({status: `It's ${presidents[this.state.id].name}. Someone needs to go back to high school.`});
	}

	render() {
		let pres = presidents[this.state.id];
		return (
			<div className="GuessPresidentApp">
				<h3>Who's this president?</h3>
				<div className="img-wrapper">
					<img src={pres.img} alt={pres.name}/>
				</div>
				<div className="inputs">
					<input type="text" id="name" onKeyPress={this.onEnter.bind(this)}
						placeholder="Enter name"/>
					<br/>
					<button id="btn-skip" onClick={this.next.bind(this)}>Skip because I'm a looser</button>
					<br/>
					<button id="btn-answer" onClick={this.answer.bind(this)}>Give up for Answer</button>
				</div>
				<div>
					<p>{this.state.status}</p>
				</div>
			</div>
		);
	}
}

export default GuessPresidentApp;
