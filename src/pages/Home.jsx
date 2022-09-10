import React , {useState,useEffect} from 'react'
import { useSelector , useDispatch } from 'react-redux'
import {DefaultLayout} from '../components/DefaultLayout'
import { getAllCars } from '../redux/actions/carsActions'
import { Col, Row  , DatePicker} from 'antd'
import {Link} from 'react-router-dom'
import Spinner from '../components/Spinner';
import moment from 'moment'
import { Slider } from '../components/Slider'
const {RangePicker} = DatePicker

const Home = ()=>{
    

    const {cars} = useSelector(state=>state.carsReducer)
    const {loading} = useSelector(state=>state.alertsReducer)
    const [totalCars , setTotalcars] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllCars())
    }, [dispatch])
    

    useEffect(() => {

        setTotalcars(cars)
        
    }, [cars])


    function setFilter(values){

        var selectedFrom = moment(values[0] , 'MMM DD yyyy HH:mm')
        var selectedTo = moment(values[1] , 'MMM DD yyyy HH:mm')

        var temp=[]

        for(var car of cars){

              if(car.bookedTimeSlots.length === 0){
                  temp.push(car)
              }
              else{

                   for(var booking of car.bookedTimeSlots) {

                       if(selectedFrom.isBetween(booking.from , booking.to) ||
                       selectedTo.isBetween(booking.from , booking.to) || 
                       moment(booking.from).isBetween(selectedFrom , selectedTo) ||
                       moment(booking.to).isBetween(selectedFrom , selectedTo)
                       )
                       {

                       }
                       else{
                           temp.push(car)
                       }

                   }

              }

        }


        setTotalcars(temp)


    }

    return(
        <DefaultLayout>

            <Slider />

            <h1 className='selectDate'>Select Date and Time to Check Available cars</h1>

             <Row className='mt-3' justify='center'>
                 
                 <Col lg={20} sm={24} className='d-flex justify-content-left'>

                 <RangePicker style={{margin:"auto"}} showTime={{format: 'HH:mm'}} format='MMM DD yyyy HH:mm' onChange={setFilter}/>
                 
                 </Col>

             </Row>

              {loading === true && (<Spinner/>)}


              
              <Row justify='center' gutter={16}>

                   {totalCars.map(car=>{
                       return <Col key={car._id} lg={5} sm={24} xs={24}>
                            <div className="car p-2 bs1">
                               <img src={car.image} alt = "" className="carimg"/>

                               <div className="car-content d-flex align-items-center justify-content-between">

                                    <div className='text-left pl-2'>
                                        <p className='rph'>{car.name}</p>
                                        <p className='rph'> Rent Per Hour {car.rentPerHour} /-</p>
                                    </div>

                                    <div>
                                    <button className="btn1 mr-2"><Link to={`/booking/${car._id}`} match={{car}}>Book Now</Link></button>
                                    </div>

                               </div>
                            </div>
                       </Col>
                   })}

              </Row>

        </DefaultLayout>
    )
    
}

export {Home}