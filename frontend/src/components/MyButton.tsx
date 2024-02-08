import { MouseEvent } from "react"

interface MyButtonProps {
    title: string,
    id: string,
    //onClick is a function that returns void
    onClick? : (event: MouseEvent) => undefined | void,
}

export default function MyButton(props: MyButtonProps) {
    return (
        // <button onClick={onClick()} id={id}>{title}</button>
        <button onClick={(event) => props.onClick?.(event)} id={props.id}>{props.title}</button>
    )
}

