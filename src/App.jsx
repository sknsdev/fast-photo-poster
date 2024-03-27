import {useEffect, useState} from 'react'
import './App.css'
import {useForm} from "react-hook-form";
import ky from "ky";
import {getWithExpiry, setWithExpiry} from "./localstorage.js";

function App() {
    //
    //
    //
    //Изменяем адрес сервера для загрузки изображений тут:
    const server_url = 'http://10.0.0.164:8000/api/web/training-set/create';
    //
    //
    //
    const lastUsedID = getWithExpiry('lastSentID')
    const [currentImageID, setCurrentImageID] = useState(Number(lastUsedID));
    const {
        register, reset, setFocus, handleSubmit
    } = useForm({})

    const onSubmit = async (data) => {
        const image = await fetch(`/photos/${currentImageID}.jpg`)
            .then(response => response.blob())
            .then(blob => {
                return blob
            })
            .catch(error => {
                console.log(error);
            });

        const formData = new FormData();
        formData.append('correct_value', data?.value?.replace(/[,;\s]/g, '.'));
        formData.append('image', image);


        await ky.post(server_url, {
            body: formData
        }).then(response => {
            console.log('success', response);
            setCurrentImageID(prev => Number(prev) + 1);
            reset();
            setFocus('value');
        }, (response) => console.log('error', response));
    }

    useEffect(() => {
        setWithExpiry('lastSentID', currentImageID)
    }, [currentImageID])

    return (<>
        <div className="container">
            <div className="navigation">
                Текущий id картинки (имя): <input value={currentImageID} type="number"
                                                  onChange={(e) => setCurrentImageID(e.target.value)}/>.jpg. <br/> Последний
                использованный id: {lastUsedID}
            </div>
            <div className="image">
                <img src={`/photos/${currentImageID}.jpg`} alt="Изображение отсутствует"/>
            </div>
            <div className="content">
                <h1> {currentImageID}.jpg </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input placeholder={'Введите значение'}
                           className={'user__input'} {...register("value", {required: true})} />
                    <p className={'user__info'}>Все <span className={'shortcut'}>пробелы</span> и символы <span
                        className={'shortcut'}>.</span> <span
                        className={'shortcut'}>;</span> <span className={'shortcut'}>,</span> будут заменены на точки.
                        <br/>
                        <br/>
                        Отправка происходит по нажатию <span className={'shortcut'}>Enter</span> и автоматически
                        переводит фокус на ввод текста.
                    </p>
                </form>
            </div>
        </div>
    </>)
}

export default App
