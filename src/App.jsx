import './App.css'
import Card from './components/Card'

function App() {

  const cars = [
    {
        "name": "Ferrari Roma",
        "image": "https://www.amalgamcollection.com/cdn/shop/files/Wideedit_44fe4a82-c08b-449e-87e3-5380099e6329_2000x850_crop_center.jpg?v=1706017250",
        "speed": "320 km/h",
        "0-100": "3.4s",
        "seats": "2+2",
        "price": "$520",
        "type": "Sport",
        "isMostPopular": true
    }, 
    {
        "name": "Volvo XC90",
        "image": "https://di-uploads-pod13.dealerinspire.com/volvocarscincinnatinorth/uploads/2025/04/Volvo-XC90-2504-.webp",
        "speed": "240 km/h",
        "0-100": "5.8s",
        "seats": "7",
        "price": "$280",
        "type": "SUV",
        "isMostPopular": false
    },
    {
        "name": "BMW M3",
        "image": "https://cdn.motor1.com/images/mgl/1ZQrxK/s1/2023-bmw-m3-cs-first-drive-review.webp",
        "speed": "280 km/h",
        "0-100": "4.1s",
        "seats": "4",
        "price": "$420",
        "type": "Sport",
        "isMostPopular": false
    },
    {
        "name": "Audi R8",
        "image": "https://www.topgear.com/sites/default/files/2024/06/1%20Audi%20R8%20GT%20review.jpg",
        "speed": "330 km/h",
        "0-100": "3.2s",
        "seats": "2+2",
        "price": "$580",
        "type": "Sport",
        "isMostPopular": false
    }, 
    {
        "name": "Lamborghini Huracán",
        "image": "https://www.lambocars.com/wp-content/uploads/2020/03/2019_huracan_evo_1.jpg",
        "speed": "325 km/h",
        "0-100": "2.9s",
        "seats": "2+2",
        "price": "$650",
        "type": "Sport",
        "isMostPopular": false
    }]

  return (
    <>
      <h1 className="easy-title">Easy Cars</h1>
      <div className="cars-container">
        {cars.map((car) => (
          <Card key={car.name} {...car} />
        ))}
      </div>
    </>
  );
}

export default App
