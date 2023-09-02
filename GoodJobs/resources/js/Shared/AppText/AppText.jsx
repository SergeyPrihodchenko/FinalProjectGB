import React from "react";
import PropTypes, { string } from "prop-types";
import s from "./AppText.module.css";
import cn from "classnames";

const mapSizeToHeader = {
    xs: "h5",
    s: "h4",
    m: "h3",
    x: "h2",
    xl: "h1",
};

export default function AppText(props) {
    const { className, title, text, size = "s", variant, bold } = props;
    const HeaderTag = mapSizeToHeader[size];
    return (
        <div className={cn(s.appText, className, s[size], s[variant], s[bold])}>
            {title && <HeaderTag className={s.title}>{title}</HeaderTag>}

            {text && <p className={s.text}>{text}</p>}
        </div>
    );
}

AppText.propTypes = {
    className: PropTypes.string,
    variant: PropTypes.oneOf([
        "primary",
        "secondary",
        "accent",
        "error",
        "cancel",
        "save",
    ]),
    size: PropTypes.oneOf(["xs", "s", "m", "l", "xl"]),
    bold: PropTypes.bool,
    title: PropTypes.string,
    text: PropTypes.string,
};