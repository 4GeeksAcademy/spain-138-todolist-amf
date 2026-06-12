import React, { useEffect, useState } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";
import { Check, Edit, Trash2, X } from "lucide-react";

const userName = "AlvaroMartin"

//create your first component
const Home = () => {

	const [todoList, setTodoList] = useState([])
	const [todo, setTodo] = useState("")
	const [editTodo, setEditTodo] = useState(null)
	const [editTodoIndex, setEditTodoIndex] = useState(null)

	async function handleAddTask(event) {
		event.preventDefault()

		const response = await fetch(`https://playground.4geeks.com/todo/todos/${userName}`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(
				{ label: todo, is_done: false }
			)
		})
		const data = await response.json()

		setTodoList((prev) => [...prev, data])
		setTodo("")
	}
	async function handleDeleteTask(id) {
		const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
			method: 'DELETE',
		})
		console.log(response.ok)
		if (response.ok) {
			setTodoList(prev => {
				return prev.filter(member => {
					return member.id !== id
				})
			})
		}

	}

	async function handleEditTask(id) {

		const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
			method: 'PUT',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(
				{ label: editTodo, is_done: false }
			)
		})
		const data = await response.json()

		setTodoList(prev => {
			return prev.map((member) => {
				if (id === member.id) { return data }
				return member
			})
		})

		setEditTodo(null)
		setEditTodoIndex(null)
	}


	async function handleAllDelete() {
		console.time('miBloque');
		const promisesArray = todoList.map((todo) => {

			handleDeleteTask(todo.id)

		})
		await Promise.all(promisesArray)
		console.timeEnd('miBloque')
	}

	async function getTodoList() {

		const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`)
		if (!response.ok) {
			await createUser()
		}
		const data = await response.json()
		return data
	}

	async function createUser() {
		const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({})

		})
		if (response.ok === true) {
			return await getTodoList()
		}

	}




	useEffect(() => {

		async function fetchGetTodoList() {
			const data = await getTodoList()
			setTodoList(data.todos)
		}

		fetchGetTodoList()
	}, [])

	return (
		<div className="container d-flex flex-column  justify-content-center aling-items-center text-center">


			<h1 className="text-center mt-5">TODO LIST</h1>

			<div>
				<form onSubmit={handleAddTask}>
					<input type="text" className="form-control" placeholder="Añadir tarea" value={todo} onChange={(e) => setTodo(e.target.value)} />
				</form>

				<ul className="list-group text-start">

					{todoList?.map((todo) => {
						return (
							<li key={todo.id} className="list-group-item d-flex justify-content-between aling-items-center">
								{editTodoIndex !== todo.id ? (
									<>
										<p className="m-0">{todo.label}</p>
										<div className="d-flex gap-2">
											<Edit onClick={() => {
												setEditTodo(todo.label)
												setEditTodoIndex(todo.id)

											}} />
											<Trash2 color="red" onClick={() => handleDeleteTask(todo.id)} />
										</div>
									</>) :
									(
										<>
											<input type="text" className="form-control" value={editTodo} onChange={(e) => setEditTodo(e.target.value)} />
											<div className="d-flex gap-2">
												<Check color="green" onClick={() => handleEditTask(todo.id)} />
												<X color="red" onClick={() => {
													setEditTodo(null)
													setEditTodoIndex(null)
												}} />
											</div>
										</>
									)
								}
							</li>

						)
					})}

				</ul>

				<button className="mt-2 btn btn-danger"
					onClick={handleAllDelete}>
					ELIMINAMOS TODAS LAS TAREAS
				</button>
			</div>

		</div >
	);
};

export default Home;