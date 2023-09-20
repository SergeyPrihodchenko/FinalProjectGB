import React from "react";
import PropTypes from "prop-types";
import s from "./VacancyPageCards.module.css";
import cn from "classnames";
import AppText from "@/8Shared/ui/AppText/AppText";
import AppButton from "@/8Shared/ui/AppButton/AppButton";
import AppCard from "@/8Shared/ui/AppCard/AppCard";
function VacancyPageCards(props) {
    const { children, className, vacancy } = props;
    const {
        title,
        payment,
        experience,
        employment,
        revievs,
        conditions,
        city,
    } = vacancy;
    // console.log("experience", experience);

    return (
        <div className={cn(s.vacancyCards, className)}>
            <AppCard shadow className={s.mainCard}>
                <AppText title={title} bold={true} size="l" />
                <AppText
                    text={`от ${payment} р.`}
                    size="m"
                    className={s.price}
                />
                <AppText
                    size="m"
                    text={`Требуемый опыт работы: ${
                        experience && experience !== "0" && experience == 0
                            ? experience
                            : "Не имеет значения"
                    }`}
                    className={s.experience}
                />
                <AppText
                    size="m"
                    text={`Тип занаятости:
                    ${employment ? employment : "По договорённости"}`}
                />
                <div>
                    {revievs ? (
                        <>
                            <AppText
                                text="Сейчас эту вакансию смотрят"
                                className={s.view}
                            />
                            <AppText
                                text={`${revievs} человека`}
                                variant="error"
                            />
                        </>
                    ) : null}
                </div>
                <AppButton className={s.btn}>Откликнуться</AppButton>
            </AppCard>
            <AppCard className={s.aboutCompany}>
                {conditions ? <AppText size="m" title={conditions} /> : null}
                {city ? (
                    <AppText size="m" title={city} />
                ) : (
                    <AppText
                        size="xs"
                        title={
                            "напоминание Поле для города не существует в пропсах вакансии .Нужно добавить "
                        }
                        variant="error"
                    />
                )}
            </AppCard>
        </div>
    );
}
VacancyPageCards.propTypes = {};

export default VacancyPageCards;
