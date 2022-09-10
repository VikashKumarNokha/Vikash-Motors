import Carousel from "nuka-carousel"
import car1 from "../images/car1.jpg"
import car2 from "../images/car2.jpg"
import car4 from "../images/car4.jpg"
import "./slider.css"

const Slider = () => {
    return (
        <div className = "cclass">
            <Carousel autoplay={true} autoplayInterval={3000} animation={"zoom"} zoomScale={0.5} dragging={true} wrapAround={true} >
                <img src={car1} />
                <img src={car2} />
                <img src={car4} />
            </Carousel>
        </div>
    )
}

export {Slider}