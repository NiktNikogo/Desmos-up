import { useState } from "react";

interface ToggleProps {
    onChange(): any,
    content: string,
    classDefault: string,
    classChanged: string,
    label_id: string
}

function Toggle({ onChange, content, classDefault, classChanged, label_id }: ToggleProps) {
    const [state, setState] = useState<boolean>(false);
    return <div className="util-button"
        onClick={() => {
            setState(!state);
            onChange();
        }}>
        <div className={state ? classDefault : classChanged}>
            <label id={label_id} style={{ cursor: "pointer" }}>
               {content}
            </label>
        </div>
    </div>
}
export default Toggle;