import "@passageidentity/passage-auth";
export default function Login(){
    return(
        <div>
            <passage-auth app-id={process.env.REACT_APP_PASSAGE_APP_ID} >

            </passage-auth>
        </div>
    )
}