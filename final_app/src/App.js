import React, {useState, useEffect} from 'react'; 

//import axios
import axios from 'axios';

//import icons
import {
  IoMdSunny,
  IoMdRainy, 
  IoMdCloudy, 
  IoMdSnow, 
  IoMdThunderstorm, 
  IoMdSearch
} from 'react-icons/io';

import {
  BsCloudHaze2Fill, 
  BsCloudDrizzleFill, 
  BsEye, 
  BsWater, 
  BsThermometer, 
  BsWind
} from 'react-icons/bs';

import { TbTemperatureCelsius } from 'react-icons/tb';
import { ImSpinner8 } from 'react-icons/im';


const APIkey = 'e2d6886cfe4758d351ffa16f7d4a5632'

/*const APIkey = {
  key: "e2d6886cfe4758d351ffa16f7d4a5632",
  base: 'https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIkey}',
}*/

const App = () => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('London');
  const [inputValue, setInputValue] = useState('');
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    //if input value is not empty
    if (inputValue !== '') {
      //set location
      setLocation(inputValue);
    }

    //select the input
    const input = document.querySelector('input');

    //if input value is empty
    if (input.value === '') {
      //set animate to true
      setAnimate(true);
      //after 500ms set animate to false
      setTimeout(() => {
        setAnimate(false);
      }, 500);
    }

    //clear the input 
    input.value = '';
    
    //saving prevent defaults
    e.preventDefault();
  };

  //call back the data of api
  useEffect(()=> {
    //set loading to true
    setLoading(true);

    const url = 'https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIkey}';

    axios.get(url).then((res) => {
      //set the data after 1500ms
      setTimeout(() => {
        setData(res.data);
        //set loading to false
        setLoading(false);
      }, 1500)
    })
    .catch((err) => {
      setLoading(false);
      setErrorMsg(err)
    })
  }, [location]);

  //error message
  useEffect(() =>{
    const timer = setTimeout(() => {
      setErrorMsg('')
    }, 2000);
    //clear timer
    return () => clearTimeout(timer);
  }, [errorMsg])

  //if data is false show the loader icon
  if (!data) {
    return (
      <div className='w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex col justify-center'>
        <div> <ImSpinner8 className='text-5x1 animate-spin text-white'/> </div>
      </div>
    );
  }

  //set the icon according to the weather
  let icon;
  console.log(data.weather[0].main);

  switch(data.weather[0].main) {
    case 'Clouds':
      icon = <IoMdCloudy />;
      break;
    case 'Haze':
      icon = <BsCloudHaze2Fill />;
    case 'Rain':
      icon = <IoMdRainy className='text-[#31cafb]'/>
      break;
    case 'Clear':
      icon = <IoMdSunny className='text-[#ffde33]' />;
      break;
    case 'Drizzle':
      icon = <BsCloudDrizzleFill className='text-[#31cafb]' />;
      break;
    case 'Snow':
      icon = <IoMdSnow className='text-[#31cafb]'/>;
      break;
    case 'Thunderstorm':
      icon = <IoMdThunderstorm />;
      break;
  }

  // date object
  const date = new Date();

  return (
    <div className='w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0'>
      {errorMsg && <div className='w-full max-w-[90vw] lg:max-w-[450px] bg-[#ff208c] text-white absolute top-2 lg:top-10 p-4 capitalize rounded-md'>{'${errorMsg.response.data.data'}</div>}
      {/* form */}
      <form className='h_16 bg-black/30 w-full max-w-[450px] rounded-full backdrop-blur[32px] mb-8'>
        <div className='h-full relative flex items-center justify-between p-2'>
          <input onChange={(e) => handleInput (e)} className='flex-1 bg-transparent outline-none placeholder:text-white text-white text-[15px] font-light pl-6 h-full' type='text' placeholder='Search by city or country'/>
          <button onClick={(e) => handleSubmit(e)} className='bg-[#1ab8ed] hover:bg-[#15abdd] w-20 h-12 rounded-full flex justify-center items-center transition'> <IoMdSearch className='text-2x1 text-white'/>  </button>
        </div>
      </form>
      {/* card */}
      <div className='w-full max-w-[450px] bg-black/20 min-h-[584px] text-white backdrop-blur-[32px] rounded-[32px] py-12 px-6'>
        {loading ? (
          <div className='w-full h-full flex justify-center items-center'>
            <ImSpinner8 className='text-white text-5x1 animate-spin'/>
          </div> 
        ) : (
        <div>
          {/*top card */}
          <div className='flex items-center gap-x-5'>
            {/* icon */}
            <div className='text-[87px]'> {icon} </div>
            <div>
              {/*country name */}
              <div className='text-2x1 font-semibold'> {data.name} {data.sys.country} </div>
              {/* date */}
              <div>{date.getUTCDate()}/{date.getUTCMonth() + 1}/{date.getUTCFullYear()} </div>
            </div>
          </div>
          {/* card body */}
          <div className='my-20'>
            <div className='flex justify-center'>
              {/* temperature */}
              <div className='text-[144px] leading-none font-light'> {parseInt(data.main.temp)} </div>
              {/* celsius icon */}
              <div className='text-4x1'> <TbTemperatureCelsius/> </div>
            </div>
            {/* weather description */}
            <div className='capitalize text-center'> {data.weather[0].description} </div>
          </div>
          {/* bottom card */}
          <div className='max-w-[378px] mx-auto flex flex-col gap-y-6'>
            <div className='flex justify-between'>
              <div className='flex items-center gap-x-2'>
                {/* icon */}
                <div className='text-[20px]'> <BsEye/> </div>
                <div> Visibility <span className='ml-2'> {data.visibility / 1000} km </span> </div>
              </div>
              <div className='flex items-center gap-x-2'>
                {/* icon */}
                <div className='text-[20px]'> <BsThermometer/> </div>
                <div className='flex'> Feels like <div className=' flex ml-2'> {parseInt(data.main.feels_like)} <TbTemperatureCelsius/> </div> </div>
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex items-center gap-x-2'>
                {/* icon */}
                <div className='text-[20px]'> <BsWater/> </div>
                <div> Humidity <span className='ml-2'> {data.main.humidity} % </span> </div>
              </div>
              <div className='flex items-center gap-x-2'>
                {/* icon */}
                <div className='text-[20px]'> <BsWind/> </div>
                <div> Wind <span className='ml-2'> {data.main.speed} m/s </span> </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default App;


/*const api = {
    key: "e2d6886cfe4758d351ffa16f7d4a5632",
    base: "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}"
}*/


