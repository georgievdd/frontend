import './mytasks-page.css';
import React, { useEffect } from 'react'
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useUserData } from '../../../hooks/useUserData';
import { getMyTasks, setTaskForRedact } from '../../../store/slices/actionCreators';
import { useMyTasks } from '../../../hooks/useMyTasks';
import FormWithTasks from '../../../forms/tasksform/FormWithTasks';
import CategoriesForm from '../../../forms/categoriesform/–°ategoriesForm';
import { useInformational_endpoint } from '../../../hooks/useInformational_endpoint';
import { getKeyByValue, getIdByEl, urlCreatePartOfPath, createTaskObject } from '../../../datafunc';
import { useNavigate } from 'react-router-dom';
import { NEWTASK, REDACTMYTASK } from '../../../components/routes/Routs';
import { useTasks } from '../../../hooks/useTasks';

const MyTasksP = () => {

  const dispatch = useDispatch();
	const navigate = useNavigate();
  const user = useUserData();
	const {subjects, 
		tags, 
		subjects_info, 
		tags_info, 
		sortsParams,
		stage_of_study_choices_info, } = useInformational_endpoint();
	const tasks = useMyTasks().tasks.map(task => createTaskObject(task, tags_info, subjects_info));

	const tagCheckHandler = index => {
		setTagsStateValue(tagsStateValue => tagsStateValue.map((e, i) => (
			i === index ? !e : e
		)));
	}
	const grouping_typeHandler = value => {
		setGrouping_type(value)
	}
	const subjectsCheckHandler = index => {
		setSubjectsStateValue(subjectsStateValue.map((e, i) => (
			i === index ? !e : e
		)))
	}
	const sortsParamsCheckHandler = value => {
		setSortTitle(value);
		setSort_type(getKeyByValue(value, sortsParams));
	}
	const sortDirectionHandler = () => {
		setSortDirection(sortDirection === '-' ? '' : '-');
 	}
	 const searchHandler = e => {
		setSeacrhValue(e.target.value);
	}

	const [searchValue, setSeacrhValue] = useState('');
	const [tagsStateValue, setTagsStateValue] = useState(useInformational_endpoint().tags.map(() => false));
	const [subjectsStateValue, setSubjectsStateValue] = useState(useInformational_endpoint().subjects.map(() => false));
	const [grouping_type, setGrouping_type] = useState("or");
	const [sort_type, setSort_type] = useState('');
	const [sortTitle, setSortTitle] = useState('');
	const [sortDirection, setSortDirection] = useState('');
  const searchTitle = '–ú–ĺ–ł –∑–į–ī–į–Ĺ–ł—Ź';
	/// –≤—Ā—ā–į–≤–ļ–į –≤ DOM
  useEffect(() => {
    dispatch(getMyTasks(user.id, ''));
  }, [])

	/// –∑–į–Ņ—Ä–ĺ—Ā —Ā —Ą–ł–Ľ—Ć—ā—Ä–į–ľ–ł 
	useEffect(() => {

		let subjectsIdArray = [];
		for (let i = 0; i < subjects.length; ++i) {
			if (subjectsStateValue[i])
				subjectsIdArray.push(getIdByEl(subjects[i], subjects_info));
		}

		let tagsIdArray = [];
		for (let i = 0; i < tags.length; ++i) {
			if (tagsStateValue[i])
				tagsIdArray.push(getIdByEl(tags[i], tags_info));
		}

		const urlPath = urlCreatePartOfPath("?", [
			["subjects", subjectsIdArray], 
			["tags", tagsIdArray], 
			["tags_grouping_type", [].concat(grouping_type)],
			["sort", [].concat(sortDirection + sort_type)]
		]);

		dispatch(getMyTasks(user.id, urlPath));

	}, [tagsStateValue, subjectsStateValue, grouping_type, sort_type, sortDirection]);

	/// search —Ā —Ą–ł–Ľ—Ć—ā—Ä–į–ľ–ł
	useEffect(() => {
		const urlPath = urlCreatePartOfPath("?", [
			["search_query", [].concat(searchValue)], 
		]);

		//console.log("urlPath:", urlPath);
		dispatch(getMyTasks(user.id, urlPath));

	}, [searchValue]);


	const addTask = () => {
		navigate(NEWTASK);
	}

	//? —Ä–Ķ–ī–į–ļ—ā–ł—Ä–ĺ–≤–į–Ĺ–ł–Ķ –∑–į–ī–į–Ĺ–ł—Ź
	const redactTask = index => {
		console.log("redact task N", index);
		dispatch(setTaskForRedact(tasks[index]));
		navigate(REDACTMYTASK);
	}

	const dataForCategories = {
		informational_endpoint: useInformational_endpoint(),
		sortDirection,
		tagCheckHandler,
		grouping_typeHandler,
		subjectsCheckHandler,
		sortsParamsCheckHandler,
		sortDirectionHandler,
		sortTitle,
	}
	const dataForTasks = {
		informational_endpoint: useInformational_endpoint(),
		tasks,
		searchValue, setSeacrhValue,
		searchHandler,
    searchTitle,
		taskMod: "taskRedact",
		redactTask,
	}

  return (
    <div className='main-container'>
    <Row>
      <Col md="auto" style={{width: "70%"}}>
        <FormWithTasks data={dataForTasks}/>
      </Col>
      <Col>
				<div className='container-element shadow mb-3' style={{padding: "10px", height: "125px"}}>
					<h5 style={{marginBottom: "28px"}}>–°–ĺ–∑–ī–į—ā—Ć –Ņ—É–Ī–Ľ–ł–ļ–į—Ü–ł—é</h5>
					<Button style={{width: "100%", height: "50px"}} variant="success" onClick={addTask}>
						–Ě–ĺ–≤–ĺ–Ķ –∑–į–ī–į–Ĺ–ł–Ķ
					</Button>
				</div>
        <CategoriesForm data={dataForCategories}/>
      </Col>
    </Row>
  </div>
  )
}

export default MyTasksP;