interface MyButtonProps {
    title: string,
    className: string,
    //onClick is a function that returns void
    onClick? : () => undefined | void,
}

export default function MyButton(props: MyButtonProps) {
    return (
        // <button onClick={onClick()} id={id}>{title}</button>
        <button onClick={() => props.onClick?.()} className={props.className}>{props.title}</button>
    )
}

