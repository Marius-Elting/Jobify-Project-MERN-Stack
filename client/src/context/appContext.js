import React, { useReducer, useContext, useEffect } from 'react'
import {
    CLEAR_ALERT,
    DISPLAY_ALERT,
    REGISTER_USER_BEGIN,
    REGISTER_USER_ERROR,
    REGISTER_USER_SUCCESS,
    LOGIN_USER_BEGIN,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,
    SETUP_USER_BEGIN,
    SETUP_USER_SUCCESS,
    SETUP_USER_ERROR,
    TOGGLE_SIDEBAR,
    LOGOUT_USER,
    UPDATE_USER_BEGIN,
    UPDATE_USER_ERROR,
    UPDATE_USER_SUCCESS,
    HANDLE_CHANGE,
    CLEAR_VALUES,
    CREATE_JOB_SUCCESS,
    CREATE_JOB_ERROR,
    CREATE_JOB_BEGIN,
    GET_JOBS_SUCCESS,
    GET_JOBS_BEGIN,
    SET_EDIT_JOB,
    DELETE_JOB_BEGIN,
    EDIT_JOB_SUCCESS,
    EDIT_JOB_ERROR,
    EDIT_JOB_BEGIN,
    SHOW_STATS_SUCCESS,
    SHOW_STATS_BEGIN,
    CLEAR_FILTERS
} from "./actions"
import reducer from "./reducer";
import axios from "axios"





const token = localStorage.getItem("token")

const location = localStorage.getItem("location")
const user = localStorage.getItem("user")

const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: "",
    alertType: "",
    user: user ? JSON.parse(user) : null,
    token: token,
    userLocation: location || "",
    jobLocation: location || "",
    showSidebar: false,
    isEditing: false,
    editJobId: '',
    position: '',
    company: '',
    jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
    jobType: 'full-time',
    statusOptions: ['pending', 'interview', 'declined'],
    status: 'pending',
    jobs: [],
    totalJobs: 0,
    numOfPages: 1,
    page: 1,
    stats: {},
    monthlyApplications: [],
    search: '',
    searchStatus: 'all',
    searchType: 'all',
    sort: 'latest',
    sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
}


const AppContext = React.createContext()


const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)


    const authFetch = axios.create({
        baseURL: '/api/v1',
    });


    // response interceptor
    authFetch.interceptors.request.use(
        (config) => {
            config.headers['Authorization'] = `Bearer ${state.token}`;
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // response interceptor
    authFetch.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            console.log(error.response);
            if (error.response.status === 401) {
                logoutUser()
            }
            return Promise.reject(error);
        }
    );


    const clearAlert = () => {
        setTimeout(() => {
            dispatch({ type: CLEAR_ALERT })

        }, 3000)
    }
    const displayAlert = () => {
        dispatch({ type: DISPLAY_ALERT })
        clearAlert()
    }

    const addUserToLocalStorage = ({ user, token, location }) => {
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("token", JSON.stringify(token))
        localStorage.setItem("location", JSON.stringify(location))
    }
    const removeUserFromLocalStorage = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        localStorage.removeItem("location")
    }


    const toggleSidebar = () => {
        dispatch({ type: TOGGLE_SIDEBAR });
    };

    // ---------------------------------------
    //          ALL ABOUT THE USER
    // ---------------------------------------

    const registerUser = async (currentUser) => {
        dispatch({ type: REGISTER_USER_BEGIN })
        try {
            const response = await axios.post("/api/v1/auth/register", currentUser)
            console.log(response)
            const { user, token, location } = response.data
            dispatch({ type: REGISTER_USER_SUCCESS, payload: { user, token, location } })
            addUserToLocalStorage({ user, token, location })
        } catch (err) {
            dispatch({ type: REGISTER_USER_ERROR, payload: { msg: err.response.data.msg } })
            console.log(err)
        }
        clearAlert()
    }

    const loginUser = async (currentUser) => {
        dispatch({ type: LOGIN_USER_BEGIN })
        try {
            const { data } = await axios.post("/api/v1/auth/login", currentUser)
            const { user, token, location } = data
            dispatch({ type: LOGIN_USER_SUCCESS, payload: { user, token, location } })
            addUserToLocalStorage({ user, token, location })
        } catch (err) {
            dispatch({ type: LOGIN_USER_ERROR, payload: { msg: err.response.data.msg } })
            console.log(err)
        }
        clearAlert()
    }


    const setupUser = async ({ currentUser, endPoint, alertText }) => {
        dispatch({ type: SETUP_USER_BEGIN })
        try {
            const { data } = await axios.post(`/api/v1/auth/${endPoint}`, currentUser)
            const { user, token, location } = data
            dispatch({ type: SETUP_USER_SUCCESS, payload: { user, token, location, alertText } })
            addUserToLocalStorage({ user, token, location })
        } catch (err) {
            dispatch({ type: SETUP_USER_ERROR, payload: { msg: err.response.data.msg } })
            console.log(err)
        }
        clearAlert()
    }

    const logoutUser = () => {
        dispatch({ type: LOGOUT_USER })
        removeUserFromLocalStorage()
    }

    const updateUser = async (currentUser) => {
        dispatch({ type: UPDATE_USER_BEGIN });
        try {
            const { data } = await authFetch.patch('/auth/updateUser', currentUser);

            // no token
            const { user, location, token } = data;

            dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: { user, location, token },
            });

            addUserToLocalStorage({ user, location, token });
        } catch (err) {
            if (err.response.status !== 401) {
                dispatch({
                    type: UPDATE_USER_ERROR,
                    payload: { msg: err.response.data.msg },
                });
            }
        }
        clearAlert();
    };


    // ---------------------------------------
    //          ALL ABOUT THE JOBS
    // ---------------------------------------

    const createJob = async () => {
        dispatch({ type: CREATE_JOB_BEGIN });
        try {
            const { position, company, jobLocation, jobType, status } = state;

            await authFetch.post('/jobs', {
                company,
                position,
                jobLocation,
                jobType,
                status,
            });
            dispatch({
                type: CREATE_JOB_SUCCESS,
            });
            // call function instead clearValues()
            dispatch({ type: CLEAR_VALUES });
        } catch (error) {
            if (error.response.status === 401) return;
            dispatch({
                type: CREATE_JOB_ERROR,
                payload: { msg: error.response.data.msg },
            });
        }
        clearAlert();
    };
    const handleChange = ({ name, value }) => {
        dispatch({
            type: HANDLE_CHANGE,
            payload: { name, value },
        })
    }

    const clearValues = () => {
        dispatch({ type: CLEAR_VALUES })
    }

    const getJobs = async () => {
        const { search, searchStatus, searchType, sort } = state;
        let url = `/jobs?status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
        if (search) {
            url = url + `&search=${search}`;
        }
        dispatch({ type: GET_JOBS_BEGIN });
        try {
            const { data } = await authFetch(url);
            const { jobs, totalJobs, numOfPages } = data;
            dispatch({
                type: GET_JOBS_SUCCESS,
                payload: {
                    jobs,
                    totalJobs,
                    numOfPages,
                },
            });
        } catch (error) {
            // logoutUser()
        }
        clearAlert();
    }

    useEffect(() => {
        getJobs()
    }, [])

    const setEditJob = (id) => {
        dispatch({ type: SET_EDIT_JOB, payload: { id } })
    }

    const editJob = async () => {
        dispatch({ type: EDIT_JOB_BEGIN });
        try {
            const { position, company, jobLocation, jobType, status } = state;

            await authFetch.patch(`/jobs/${state.editJobId}`, {
                company,
                position,
                jobLocation,
                jobType,
                status,
            });
            dispatch({
                type: EDIT_JOB_SUCCESS,
            });
            dispatch({ type: CLEAR_VALUES });
        } catch (error) {
            if (error.response.status === 401) return;
            dispatch({
                type: EDIT_JOB_ERROR,
                payload: { msg: error.response.data.msg },
            });
        }
        clearAlert();
    };

    const deleteJob = async (jobId) => {
        dispatch({ type: DELETE_JOB_BEGIN });
        try {
            await authFetch.delete(`/jobs/${jobId}`);
            getJobs();
        } catch (error) {
            logoutUser();
        }
    };

    const showStats = async () => {
        dispatch({ type: SHOW_STATS_BEGIN })
        try {
            const { data } = await authFetch('/jobs/stats')
            dispatch({
                type: SHOW_STATS_SUCCESS,
                payload: {
                    stats: data.defaultStats,
                    monthlyApplications: data.monthlyApplications,
                },
            })
        } catch (error) {
            console.log(error.response)
            // logoutUser()
        }

        clearAlert()
    }


    const clearFilters = () => {
        dispatch({ type: CLEAR_FILTERS });

    }

    return (
        <AppContext.Provider value={{
            ...state,
            displayAlert,
            registerUser,
            loginUser,
            setupUser,
            toggleSidebar,
            logoutUser,
            updateUser,
            handleChange,
            clearValues,
            createJob,
            getJobs,
            setEditJob,
            deleteJob,
            editJob,
            showStats
        }}>
            {children}
        </AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext)
}

export {
    AppProvider, initialState, useAppContext
}
