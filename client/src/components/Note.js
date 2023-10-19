export default function Note(props) {

    return (
        <div className="note">
            <div className="note-header">
                <h1>{props.title}</h1>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    <i class="fa-regular fa-trash-can" onClick={props.onTrashClick}></i>
                    <span class="visually-hidden">unread messages</span>
                </span>
            </div>
            <div className="note-content" onClick={props.onModalClick}>
                <p>{props.content}</p>
                <p className="note-date">{props.date}</p>
            </div>
        </div>
    );
}