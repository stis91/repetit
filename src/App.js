import './App.css'
import Select from './component/Select'
import Button from './component/Button'
import TutorCard from './component/TutorCard'
import { useState, useEffect } from 'react'


const tutorPerDownload = 10

function App() {


  const [subjects, setSubjects] = useState([])
  const [areas, setAreas] = useState([])
  const [disctricts, setDisctricts] = useState([])


  const [selectedSubjectData, setSelectedSubjectData] = useState({ name: '', id: null })
  const [selectedAreaData, setSelectedAreaData] = useState({ name: '', id: null })
  const [selectedDistrictData, setSelectedDistrictAreaData] = useState({ name: '', id: null })

  const [availableTutors, setAvailableTutors] = useState([])

  const [tutorsToShow, setTutorsToShow] = useState([77475, 41671, 258])
  const [tutorsShortData, setTutorsShortData] = useState([]) // для более детальной информации по туторам
  const [next, setNext] = useState(10)

  useEffect(() => {

    loopWhithSLice(0, tutorPerDownload)

  }, [availableTutors])

  useEffect(() => {

    Promise.all([
      fetch('https://api.repetit.ru/public/subjects'),
      fetch('https://api.repetit.ru/public/areas')
    ]).then(responses => Promise.all(responses.map(r => r.json())))
      .then(data => {
        setSubjects(data[0])
        setAreas(data[1])
      })
  }, [])

  useEffect(() => {
    let query = '?'
    tutorsToShow.forEach((id, i) => {
      query += `Ids[${i}]=${id}&`
    })
    let url = 'https://api.repetit.ru/public/teachers/short'
    const fetchData = async () => {
      const rawData = await fetch(url + query)
      const data = await rawData.json()
      setTutorsShortData(data)
    }

    fetchData()


  }, [tutorsToShow])


  useEffect(() => {
    fetch('https://api.repetit.ru/public/districts?AreaId=' + (selectedAreaData.id || 1))
      .then(response => response.json())
      .then(data => setDisctricts(data))
      .catch(err => console.error(err))
  }, [selectedAreaData.id])
  // TODO: если не выбран город, то районы выбираются московские, нужно что бы было пусто.

 

  const loopWhithSLice = (start, end) => {
    const slicedTutors = availableTutors.slice(start, end)
    setTutorsToShow(prevState => {
      return prevState.concat(slicedTutors)
    })

  }

  const applyFilter = () => {
    setTutorsToShow([])

    const getData = async () => {
      const url = `https://api.repetit.ru/public/search/teacherIds?areaId=${selectedAreaData.id}&districtId=${selectedDistrictData.id}&subjectId=${selectedSubjectData.id}`
      try {
        const rawData = await fetch(url)
        const tutors = await rawData.json()
        setAvailableTutors(tutors)

      } catch (err) {
        console.log(err)
      }
    }

    getData()



  }
  const getMoreTutors = () => {
    loopWhithSLice(next, next + tutorPerDownload)
    setNext(next + tutorPerDownload)
    //TODO: Если элементов массива больше нет - вывести предупреждение пользователю что больше доступных преподавателей нет 

  }
  return (
    <div className='wrapper'>
      <div className='filter-panel'>
        <Select
          defaultValue='Укажите предмет'
          value={selectedSubjectData.name}
          onChange={setSelectedSubjectData}
        >

          {
            subjects.map(subject => {
              return (
                { id: subject.id, name: subject.name }
              )
            })
          }
        </Select>
        <Select
          defaultValue='Укажите город'
          value={selectedAreaData.name}
          onChange={setSelectedAreaData}
        >
          {
            areas.map(areas => {
              return (
                { id: areas.id, name: areas.cityName }
              )
            })
          }
        </Select>

        <Select
          defaultValue='Укажите район'
          value={selectedDistrictData.name}
          onChange={setSelectedDistrictAreaData}
        >
          {
            disctricts.map(district => {
              return (
                { id: district.id, name: district.name }
              )
            })

          }



        </Select>

        <Button
          onClick={applyFilter}
          className='btn-main'
        > Применить фильтр </Button>
      </div>
      <main>
        <div className='tutors-cards'>
          {
            tutorsShortData.map(tutor => {
              return (
                <TutorCard key={tutor.id} tutorObject={{
                  subject: tutor.teachingSubjects[0].subject.name,
                  photoPath: tutor.photoPathSquare,
                  firstName: tutor.firstName,
                  patrName: tutor.patrName,
                  id: tutor.id,
                  minPricePerHour: tutor.minPricePerHour

                }} />
              )
            })
          }
        </div>


        <Button onClick={getMoreTutors} className='btn-accent'> Загрузить еще </Button>
      </main>

    </div>
  )
}

export default App;
