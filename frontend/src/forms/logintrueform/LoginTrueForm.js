import React, { useState } from 'react'
import { Button, Container, Nav, Dropdown, Offcanvas, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import profileImgDefault from '../../res/img/profileScreenDefault.png';
import bellImg from '../../res/img/bell_dark.svg';
import sircleImg from '../../res/img/sircle.png';
import { useDispatch } from 'react-redux';
import { deleteUser } from '../../store/slices/userSlice';
import { useUserData } from '../../hooks/useUserData';
import { MYAPPLICATIONS, MYTASKS, PROFILE, TASKS, TODOTASKS } from '../../components/routes/Routs';
import NotificationForm from '../notificationform/NotificationForm';
import api from '../../api';
import { useAuth } from '../../hooks/useAuth';

const LoginTrueForm = props => {

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [showNotifications, setShowNotifications] = useState(false);
	const closeNotifications = () => {
		setShowNotifications(false);
		window.location.reload();
	}

	const {
		notifications,
		New,
		user,
	} = props.data;

	const {access} = useAuth();

	const {
		username,
	} = user;

	const openShowNotifications = () => {
		api.notifications.notificationsClear(access)
		setShowNotifications(true);
	}

	let profileImg = useUserData().profile_image;

	if (!profileImg) profileImg = profileImgDefault;

	const handler = () => {
		navigate(TASKS);
		dispatch(deleteUser());
	}

	const profileNavigate = () => {
		navigate(PROFILE);
	}

	const notificationsHandler = () => {
		if (New < 100) return New;
		return "99+";
	}

	return (
		<div>
			<Nav style={{width: "100%"}}>
				<Nav.Link style={{paddingRight: "30px"}}><Link className='link-standart' to={TASKS}>Задания</Link></Nav.Link>
				<Nav.Link style={{paddingRight: "30px"}}><Link className='link-standart' to={MYTASKS}>Мои задания</Link></Nav.Link>
				<Nav.Link style={{paddingRight: "30px"}}><Link className='link-standart' to={TODOTASKS}>todo tasks</Link></Nav.Link>
				<Nav.Link style={{paddingRight: "30px"}}><Link className='link-standart' to={MYAPPLICATIONS}>Мои заявки</Link></Nav.Link>
				{/* <img
					style={{marginRight: "10px"}}
					width="40px"
					height="40px"
					src={bellImg}
					onClick={openShowNotifications}
					
				/>
				<div style={{position: "absolute", marginLeft: "400px"}}>
					<div style={{width: "25px", color: "white", position: "absolute", marginRight: "10px"}}>
						<p style={{marginTop: "5px", fontSize: "12px"}}>{notificationsHandler()}</p>
					</div>
					<img
						width="28px"
						height="28px"
						src={sircleImg}
					/>
				</div> */}
				<Dropdown style={{display: "inline-block"}}>
				<Dropdown.Toggle variant="dark" id="dropdown-basic">
					<div className='nav-button'>{username} <Badge bg="secondary">{notificationsHandler()}</Badge></div>
				</Dropdown.Toggle>

				<Dropdown.Menu>
					<Dropdown.Item onClick={profileNavigate}>Профиль</Dropdown.Item>
					<Dropdown.Item onClick={openShowNotifications}>Уведомления {`(${notificationsHandler()})`}</Dropdown.Item>
					<Dropdown.Item onClick={handler} className='nav-how-text'>Выйти</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
				<img
					style={{borderRadius: "50%"}}
					width="40px"
					height="40px"
					src={profileImg}
				/>
			</Nav>
			
			<Offcanvas placement="end" show={showNotifications} onHide={closeNotifications}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Уведомления</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
					{
						notifications.map(notification => (
							<div className='mb-3'>
								<NotificationForm data={notification}/>
							</div>
						))
					}
        </Offcanvas.Body>
      </Offcanvas>
		</div>
	)
}

export default LoginTrueForm;