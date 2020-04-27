import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, Form } from 'react-bootstrap';
import actions from './actions';
//import languages from './languages.json.js';
import config from '../../config/config';
import composeHeader from '../../shared/Helpers/headers';
import { Redirect } from 'react-router-dom';


const NS = 'Login';

export const Login = props => {
	//i18n.customLoad(languages, NS);
	// const { t } = useTranslation(NS);

	const [user, setUser] = useState('');
	const [pass, setPass] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(props.message ? props.message : '');

	const onSubmit = e => {
		e.preventDefault();
		login(user, pass);
	};

	useEffect(() => {
		console.log("user",props.user);
	}, [user])

	const login = (user, pass) => {
		let body = JSON.stringify({ username: user, password: pass });

		setMessage('');
		setLoading(true);
		return fetch('/api/auth/login', { headers: composeHeader(), body, method: 'POST' })
			.then(res => {
				if (res.status === 200) return res.json();
				setMessage(res.statusText);
				return Promise.reject(res);
			})
			.then(res => {
				setLoading(false);
				if (res) {
					console.log(res.user);
					res.loggedIn = new Date().toString();
					props.setToken(res.token);
					props.setUser(res.user);
					console.log("setUser", props.user);
				}else{
					setMessage('Wrong credentials');
				}
			})
			.catch(err => {
				setLoading(false);
				console.log(err);
				err.status === undefined && setMessage('Endpoint unreachable');
			});
	};
	// console.log(props);
	// if (props.user && props.user.name) {
	// 	console.log("user:", props.user)
	// 	return <Redirect to="/"/>
	// }else{
	// 	console.log("no user", user);
	// }
	return (
		
		<div className={"container "+NS}>
			<h3>Login</h3>
			<Form onSubmit={onSubmit}>
				<Form.Group controlId='formBasicEmail'>
					<Form.Label>User</Form.Label>
					<Form.Control type='email' placeholder='Enter email' onChange={e => setUser(e.target.value)} />
					
				</Form.Group>

				<Form.Group controlId='formBasicPassword'>
					<Form.Label>Password</Form.Label>
					<Form.Control type='password' placeholder='Password' onChange={e => setPass(e.target.value)} />
				</Form.Group>
				{message && <Alert variant='danger'>{message}</Alert>}
				{!loading && <Button variant='primary' type='submit'>
					Login
				</Button>
				}
				{loading && "Loading"}
			</Form>
		</div>
	)
}

const mapStateToProps = (state, props) => ({
	user: state.user,
	token: state.token
});

const mapDispatchToProps = dispatch => {
	return {
		setUser: user => dispatch(actions.setUser(user)),
		setToken: token => dispatch(actions.setToken(token)),
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
