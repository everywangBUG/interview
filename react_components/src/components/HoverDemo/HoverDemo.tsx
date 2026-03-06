import useHover from "../../hooks/useHover"

const HoverDemo = () => {
    const element = (hovered: boolean) => <div>
        Hover me! {hovered}
    </div>
    
    const [hoverable, hovered] = useHover(element);

    return (
        <div>
            {hoverable}
            <div>{hovered ? 'HOVERED' : ''}</div>
        </div>
    )
}

export default HoverDemo;