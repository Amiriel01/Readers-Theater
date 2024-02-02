interface MyButtonProps {
    title: string,
    id: string,
    //onClick is a function that returns void
    onClick? : () => undefined | void,
}

export default function MyButton(props: MyButtonProps) {
    return (
        // <button onClick={onClick()} id={id}>{title}</button>
        <button onClick={() => props.onClick?.()} id={props.id}>{props.title}</button>
    )
}

