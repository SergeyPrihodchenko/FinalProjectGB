import { AppPage } from "@/5Layouts/AppPage/AppPage";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { router } from '@inertiajs/react'
import AppText from "@/8Shared/ui/AppText/AppText";
import AppLink from "@/8Shared/ui/AppLink/AppLink";
import AppCard from "@/8Shared/ui/AppCard/AppCard";
import AppButton from "@/8Shared/ui/AppButton/AppButton";
import axios from "axios";
import Loader from "@/8Shared/Loader/Loader";
import s from "./VacancyListPage.module.css";
import cn from "classnames";
import AppInput from "@/8Shared/ui/AppInput/AppInput";
import { Head } from "@inertiajs/react";
import VacancyListPageFilters from "./ui/VacancyListPageFilters/VacancyListPageFilters";
import useDebounce from "@/8Shared/Search/useDebounce";
import List from "@/8Shared/List/List";
import { useDispatch, useSelector } from "react-redux";
import { decrement, increment } from "@/1App/providers/counterSlice/counterSlice";
import { BootstrapIcon } from "@/8Shared/Icon/BootstrapIcon";

const VacancyListPage = ({
    vacancies,
    title,
    auth,
    experience,
    schedule,
    employment,
    cities,
    likes
}) => {
    console.log('likes', likes);
    const user = auth?.user;
    const [vacancyList, setVacancyList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [index, setIndex] = useState(0);
    const [total, setTotal] = useState(0);
    const loaderRef = useRef(null);

    const [extendedDescription, setExtendedDescription] = useState(false);

    const [payment, setPayment] = useState(''); // состояние инпута зарплаты
    const debouncedPayment = useDebounce(payment, 500);

    const [filterData, setFilterData] = useState({
        employment: [],
        schedule: [],
        experience: "",
        city_id: [],
        title: vacancies ? vacancies : '',
        payment: 0,
        // user_id: user.id
    });
    //поиск по названию вакансии
    const [vacancySearchInput, setVacancySearchInput] = useState(vacancies ? vacancies : ''); // состояние инпута поиска по названию вакансии
    const [suggestions, setSuggestions] = useState([]);
    const debouncedVacancySearch = useDebounce(vacancySearchInput, 500);
    const [suggestionsActive, setSuggestionsActive] = useState(false);


    const [favourites, setIsFavourites] = useState(likes);
    console.log('vacancySearchInput', vacancySearchInput);
    console.log('vacancies', vacancies);
    console.log(favourites);
    const handleVacancySearchInput = (e) => {
        const { value } = e.target;
        setVacancySearchInput(value);

    }

    const handlePayment = () => {
        setFilterData((prevState) => {
            return {
                ...prevState,
                payment: Number(payment)
            }
        })
    }

    const toggleFavourites = async (id) => {
        if (!favourites.length) {
            setIsFavourites([...favourites, id]);
            await axios.post('/addLike', { like: { user_id: user.id, vacancy_id: id } });
        } else {
            if (favourites.includes(id)) {
                setIsFavourites(favourites.filter((favourite) => favourite !== id))
                await axios.post('/deleteLike', { id: { vacancy_id: id } });

            } else {
                setIsFavourites([...favourites, id]);
                await axios.post('/addLike', { like: { user_id: user.id, vacancy_id: id } });

            }
        }

    }
    const isInFavourite = (id, list) => {
        return list.some(el => el === id)
    }
    // const getFilterData = async () => {
    //     const response = await axios.post(`/vacancies/filter?page=1`, {
    //         filterData: filterData,
    //     });
    //     const { data } = response.data;
    //     setVacancyList(data);
    //     setTotal(response.data.total);
    //     setIndex((prevIndex) => prevIndex + 1);
    //     console.log(data);
    // };
    // getFilterData();


    useEffect(() => {
        // if (!debouncedVacancySearch) return;
        if (!debouncedVacancySearch) {
            setFilterData((prevState) => {
                return {
                    ...prevState,
                    title: '',
                };
            });
            setSuggestions([]);
            return;
        };

        axios
            .get(`/searchSort?str=${debouncedVacancySearch}`)
            .then((res) => {
                setSuggestions(res.data);
            })
            .catch((err) => console.log(err));
        setFilterData((prevState) => {
            return {
                ...prevState,
                title: debouncedVacancySearch,
            };
        });
    }, [debouncedVacancySearch]);


    const handleSuggestionClick = (e) => {
        setSuggestions([]);
        setVacancySearchInput(e.target.innerText);
        setSuggestionsActive(false);
    }

    const fetchVacancyCards = useCallback(async () => {
        if (isLoading) return;

        setIsLoading(true);

        axios
            .post(`/vacancies/filter?page=${index}`, { filterData: filterData })
            .then((res) => {
                if (res.data.data.length) {
                    setVacancyList((prevVacancyList) => [
                        ...prevVacancyList,
                        ...res.data.data,
                    ]);
                    setIsLoading(false);
                } else {
                    return;
                }
            })
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false));

        setIndex((prevIndex) => prevIndex + 1);
    }, [index, isLoading]);

    useEffect(() => {
        if (vacancyList.length !== total) {
            const observer = new IntersectionObserver((entries) => {
                const target = entries[0];
                if (target.isIntersecting) {
                    fetchVacancyCards();
                }
            });

            if (loaderRef.current) {
                observer.observe(loaderRef.current);
            }

            return () => {
                if (loaderRef.current) {
                    observer.unobserve(loaderRef.current);
                    setIsLoading(false);
                }
            };
        }
    }, [loaderRef, vacancyList]);

    // useEffect(() => {
    //     if (!vacancies) {
    //         const getData = async () => {
    //             setIsLoading(true);
    //             try {
    //                 const response = await axios.post(`/vacancies/filter?page=1`, { filterData: {} });
    //                 setVacancyList(response.data.data);
    //                 setTotal(response.data.total);
    //             } catch (error) {
    //                 console.log(error);
    //             }
    //             setIsLoading(false);
    //         };

    //         getData();
    //     }
    // }, []);

    // const setValueChange = (value) => {
    //     setFilterData((prevState) => {
    //         return {
    //             ...prevState,
    //             title: value,
    //         };
    //     });
    //     console.log(filterData.title);
    // };

    const handleChange = (event) => {
        const { value, checked, name, type } = event.target;
        setIndex(1);

        switch (type) {
            case "checkbox":
                let copy = { ...filterData };
                checked
                    ? copy[name].push(value)
                    : copy[name].splice(copy[name].indexOf(value), 1);
                setFilterData(copy);
                break;
            case "radio":
                if (checked) {
                    setFilterData((prevState) => {
                        return {
                            ...prevState,
                            [name]: value,
                        };
                    });
                }
                break;
            case "text":
                const pattern = /^\d+$/;
                if (pattern.test(value)) {
                    setPayment(value);

                } else {
                    setPayment('');
                }
                break;
            default:
                setFilterData(filterData);
                break;
        }
    };

    useEffect(() => {
        const getFilterData = async () => {
            const response = await axios.post(`/vacancies/filter?page=1`, {
                filterData: filterData,
            });
            const { data } = response.data;
            setVacancyList(data);
            setTotal(response.data.total);
            setIndex((prevIndex) => prevIndex + 1);
            console.log(data);
        };
        getFilterData();
    }, [filterData]);

    // ---------- Redux ----------
    // const counter = useSelector((state) => state.counter.value);
    // const dispatch = useDispatch();
    // const handlIncrement = () => {
    //     dispatch(increment());
    // }
    // const handlDecrement = () => {
    //     dispatch(decrement());
    // }

    return (
        <>
            <Head title={title} />
            <AppPage>
                {/* Redux */}
                {/* <button onClick={handlIncrement}>+</button>
                <button onClick={handlDecrement}>-</button>
                <b>count: {counter}</b> */}
                <div className={s.filterSearchVacancy}>
                    <form action="" className={s.vacancySearch}>
                        <AppInput

                            autoComplete="off"
                            width={'550px'}
                            name={'title'}
                            placeholder={'Поиск вакансии'}
                            value={vacancySearchInput}
                            onChange={handleVacancySearchInput}
                            onClick={() =>
                                setSuggestionsActive(!suggestionsActive)
                            }
                        />
                    </form>
                    {suggestionsActive && (
                        <List
                            className={s.serachFilterSuggestions}
                            list={suggestions}
                            renderItem={(suggestion) =>
                                <li
                                    key={suggestion.id}
                                    className={s.serachFilterSuggestion}
                                    onClick={handleSuggestionClick}
                                >
                                    {suggestion.title}
                                </li>}

                        />
                    )}
                </div>
                <div className={s.vacancyWrapper}>
                    <VacancyListPageFilters
                        employment={employment}
                        payment={payment}
                        cities={cities}
                        schedule={schedule}
                        experience={experience}
                        handleChange={handleChange}
                        handlePayment={handlePayment}
                    />

                    <div className={s.vacancyList}>
                        <div className={s.descBlock}>
                            {vacancyList.length > 0 ?
                                <AppText bold text={`Найдено ${total} вакансии`} /> :
                                <AppText bold text={`Ничего не найдено`} />
                            }
                            <div className={s.toggleDescBtn}>
                                <AppButton
                                    width={'40px'}
                                    height={'40px'}
                                    variant='clear'
                                    onClick={() => setExtendedDescription(false)}
                                    className={cn(s.hideDescBtn, {
                                        [s.pressed]: !extendedDescription
                                    })}
                                >
                                    <span></span>

                                </AppButton>
                                <AppButton
                                    width={'40px'}
                                    height={'40px'}
                                    variant='clear'
                                    onClick={() => setExtendedDescription(true)}
                                    className={cn(s.showDescBtn, {
                                        [s.pressed]: extendedDescription
                                    })}
                                >
                                    <span></span>
                                </AppButton>

                            </div>

                        </div>
                        {vacancyList.map(vac =>
                            <div className={s.vacancyListCardWrapper}>
                                <AppLink

                                    path={'vacancy.show'}
                                    param={vac.id}
                                    key={vac.id}
                                >
                                    <AppCard
                                        width={'auto'}
                                        height={extendedDescription ? `300px` : `260px`}
                                        shadow
                                        className={cn(s.vacancyListCard)}
                                    >
                                        <AppText
                                            title={vac.title}
                                        />
                                        <AppText
                                            text={`от ${vac.payment} руб.`}
                                        />
                                        <AppText
                                            text={`Компания ${vac.conditions}.`}
                                        />
                                        <AppText
                                            size="s"
                                            variant="notaccented"
                                            text={`Город: ${vac.city}`}
                                        />

                                        <AppText
                                            size="s"
                                            variant="notaccented"
                                            text={`Опыт работы: ${vac.experience}`}
                                            className={s.vacancyListCardExp}
                                        />
                                        <div className={s.vacancyListCardParam}>
                                            <AppText
                                                size={'s'}
                                                variant={'secondary'}
                                                text={vac.employment}
                                                className={s.vacancyListCardEmployment}
                                            />
                                            <AppText
                                                size={'s'}
                                                variant={'secondary'}
                                                text={vac.schedule}
                                                className={s.vacancyListCardSchedule}

                                            />

                                        </div>
                                        {extendedDescription &&
                                            <AppText
                                                size={'xs'}
                                                text={vac.description.length > 120 ? `${vac.description.substring(0, 115)}...` : vac.description}
                                                className={s.vacancyListCardDesc}
                                            />
                                        }

                                        <AppButton
                                            className={s.vacancyListCardBtn}
                                            width="auto"
                                        >
                                            Откликнуться
                                        </AppButton>

                                    </AppCard>
                                </AppLink>
                                <AppButton
                                    variant={'clear'}
                                    className={cn(s.addToFavouriteBtn)}
                                    onClick={() => toggleFavourites(vac.id)}
                                >
                                    {isInFavourite(vac.id, favourites) ?
                                        <BootstrapIcon name={'BsHeartFill'} size={28} />
                                        :
                                        <BootstrapIcon name={'BsHeart'} size={28} />

                                    }
                                </AppButton>
                            </div>
                        )}
                        <div ref={loaderRef}>{isLoading && <Loader />}</div>
                    </div>
                </div>
            </AppPage>
        </>
    );
};
export default VacancyListPage;
