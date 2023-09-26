import Checkbox from "@/8Shared/Checkbox/Checkbox";
import s from "./VacancyListPageFilters.module.css"
import cn from "classnames"
import List from "@/8Shared/List/List";
import AppText from "@/8Shared/ui/AppText/AppText";
import RadioButton from "@/8Shared/RadioButton/RadioButton";
import AppInput from "@/8Shared/ui/AppInput/AppInput";
import { useState } from "react";
import { useEffect } from "react";

const VacancyListPageFilters = ({
    employment,
    experience,
    schedule,
    cities,
    handleChange,
    className
}) => {
    const [cityInput, setCityInput] = useState('');
    const [filterCityList, setFilterCityList] = useState(cities);

    const handleCityInput = (e) => {
        const value = e.target.value;
        setCityInput(value);

    }
    useEffect(() => {
        if (cityInput) {
            const newList = cities.filter((city) => city.title.toLowerCase().startsWith(cityInput.toLocaleLowerCase()));
            setFilterCityList(newList);

        } else {
            setFilterCityList(cities);
        }

    }, [cityInput]);
    return (
        <div className={cn(s.filterContainer, className)}>
            <form action="">
                <AppText
                    text="Тип занятости"
                    bold
                    className={s.vacancyFilterTitle}
                />
                <List
                    list={employment}
                    renderItem={(item) =>
                        <li key={item}>
                            <Checkbox
                                label={item}
                                name={'employment'}
                                checkHandler={handleChange}
                                value={item}
                            />
                        </li>
                    }
                />
                <AppText
                    text="Опыт работы"
                    bold
                    className={s.vacancyFilterTitle}
                />
                <RadioButton
                    name={'experience'}
                    label={'Не имеет значения'}
                    value={''}
                    onChange={handleChange} />

                <List
                    list={experience}
                    renderItem={(item) =>
                        <RadioButton
                            key={item}
                            label={item}
                            name={'experience'}
                            onChange={handleChange}
                            value={item}
                        />}

                />
                <AppText
                    text="График работы"
                    bold
                    className={s.vacancyFilterTitle}
                />
                <List
                    list={schedule}
                    renderItem={(item) =>
                        <Checkbox
                            key={item}
                            label={item}
                            name={'schedule'}
                            checkHandler={handleChange}
                            value={item}
                        />}


                />
                <AppText
                    text="Город"
                    bold
                    className={s.vacancyFilterTitle}
                />
                <AppInput
                    width={'auto'}
                    className={s.citiesInput}
                    placeholder={'Поиск города'}
                    value={cityInput}
                    onChange={handleCityInput}
                />
                <List
                    className={s.citiesList}
                    list={filterCityList}
                    renderItem={(city) =>
                        <Checkbox
                            key={city.id}
                            label={city.title}
                            name={'city_id'}
                            value={city.id}
                            checkHandler={handleChange}
                        />
                    }
                />
            </form>
        </div>
    )
}

export default VacancyListPageFilters;