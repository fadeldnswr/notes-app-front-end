
import axios from "axios";
import { Button } from "primereact/button"
import { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

const url = "http://localhost:5000/notes";

const ButtonNotes = ({deleteAllNotes, fetchNotes}) => {
  const [bodyValue, setBodyValue] = useState("");
  const [titleValue, setTitleValue] = useState("");
  const [visible, setVisible] = useState(false);
  const toast = useRef(null);

  // Add Notes button
  const addNotesSubmitButton = async () => {
    if(!titleValue || !bodyValue) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Title and content can't be empty!",
        life: 3000
      });
      return;
    }

    try {
      const newNotes = {
        title: titleValue,
        body: bodyValue,
      }
      await axios.post(`${url}`, newNotes);

      // Reset Input
      setTitleValue("");
      setBodyValue("");
      setVisible(false);

      fetchNotes();

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Notes added successfully",
        life: 3000
      });

    } catch(error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to add notes",
        life: 3000
      });
      console.error(`Failed to add notes...${error}`)
    }
  }

  // Cancel Notes Button
  const cancelNotesSubmitButton = () => {
    setVisible(!visible);
    setTitleValue("");
    setBodyValue("");
    toast.current.show({
      severity: "error",
      summary: "Cancelled",
      detail: "Failed to add notes",
      life: 3000
    })
  }


  return (
    <div className="btn">
      <Toast ref={toast}/>
      <Button label="Add Notes" onClick={() => setVisible(!visible)} severity="secondary"/>

      {/* Add Notes Open Dialogue */}
      <Dialog 
      header="New Notes" 
      visible={visible}  
      style={{width: "37vw"}} 
      onHide={() => {if (!setVisible) return; setVisible(false)}}>
        <div>
          {/* Input Title Content */}
          <div>
            <label htmlFor="title" style={{marginBottom: "10px"}}>Title</label>
            <InputText 
            value={titleValue} 
            onChange={(event) => setTitleValue(event.target.value)} 
            style={{width: "34vw"}} 
            id="title"
            />
          </div>

          {/* Input Body Content */}
          <div style={{marginTop: "10px"}}>
            <label htmlFor="title">Content</label>
            <InputText 
            value={bodyValue} 
            onChange={(event) => setBodyValue(event.target.value)} 
            style={{width: "34vw", height: "5vw"}} 
            className="input-form"/>
          </div>
        </div>

        {/* Add Notes Dialogue Button */}
        <div className="btn-dialogue">
          <Button 
          label="Confirm" 
          onClick={addNotesSubmitButton} 
          severity="secondary"/>
          <Button 
          label="Cancel" 
          severity="danger" 
          className="btn-style" 
          onClick={cancelNotesSubmitButton}/>
        </div>
      </Dialog>
      <Button label="Delete All" severity="danger" className="btn-style" onClick={deleteAllNotes}/>
    </div>
  )
}

export default ButtonNotes;