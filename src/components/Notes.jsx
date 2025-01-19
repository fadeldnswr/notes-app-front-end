import { useEffect, useRef, useState } from "react";
import ButtonNotes from "./ButtonNotes";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

const url = "http://localhost:5000/notes";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [visible, setVisible] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [bodyValue, setBodyValue] = useState("");
  const [editNote, setEditNote] = useState(null);
  const toast = useRef(null);

  // Fetching Data
  const fetchNotes = async () => {
    const response = await axios.get(url);
    setNotes(response.data.data.notes);
  }
  
  // Delete Notes Function
  const deleteAllNotes = async () => {
    try {
      const response = await axios.delete(url);
      if(response.data.status === "Success") {
        setNotes([]);
      }
      else {
        console.error("Failed to delete all notes");
      }
    } catch (error) {
      console.error("Failed to delete notes", error);
    }
  }

  const openEditDialog = (note) => {
    setEditNote(note);
    setBodyValue(note.body);
    setTitleValue(note.title);
    setVisible(true);
  } 

  // Add Notes Submit
  const saveEditNotes = async () => {
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
        ...editNote,
        title: titleValue,
        body: bodyValue,
      }
      await axios.put(`${url}/${editNote.id}`, newNotes);
      fetchNotes();
      setVisible(false);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Notes updated successfully",
        life: 3000
      });

    } catch (error) {
      toast.current.show({
        severity: error,
        summary: "Error",
        detail: "Failed to edit notes",
        life: 3000
      })
    }
  }

  // Cancel Notes Submit
  const cancelNotesSubmitButton = () => {
    setVisible(false);
    setTitleValue("");
    setBodyValue("");
    toast.current.show({
      severity: "error",
      summary: "Cancelled",
      detail: "Failed to edit notes",
      life: 3000
    })
  }

  // Delete Notes by ID
  const deleteNote = async (id) => {
    try {
      const response = await axios.delete(`${url}/${id}`);
      if(response.data.status === "Success") {
        setNotes(notes.filter((note) => note.id === id))
        fetchNotes();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Notes deleted successfully",
          life: 3000
        });
      }
    } catch(error) {
      toast.current.show({
        severity: error,
        summary: "Error",
        detail: "Failed to delete notes",
        life: 3000
      })
    }
  }
  
  useEffect(() => {
    fetchNotes();
  }, [])



  return (
    <>
    <Toast ref={toast}/>
      <div className="notes">
        <div className="notes-manager">
          <div className="notes-container">
            {notes.map((note) => {
              const {id, title, body} = note;
              return (
                // Notes Card
                <Card key={id} title={title} style={{minHeight: "220px"}}>
                  <p style={{textAlign: "justify"}}>{body}</p>
                  <Button 
                  className="btn-card" 
                  title="Edit" 
                  severity="primary"
                  onClick={() => openEditDialog(note)}
                  style={{marginRight: "10px", width: "90px", justifyContent: "center"}}>Edit</Button>
                  <Button 
                  title="Delete" 
                  severity="danger" 
                  onClick={() => deleteNote(id)}
                  className="btn-card">Delete</Button>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
      <Dialog 
      header="Edit Notes" 
      visible={visible} 
      style={{width: "37vw"}} 
      onHide={() =>{if (!setVisible) return; setVisible(false)}}>
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
          <div style={{marginTop: "10px"}}>
            <label htmlFor="body">Content</label>
            <InputText 
            value={bodyValue} 
            onChange={(event) => setBodyValue(event.target.value)} 
            style={{width: "34vw", height: "5vw"}} 
            className="input-form"/>
          </div>
        </div>

        <div className="btn-dialogue">
          <Button 
          label="Confirm" 
          onClick={saveEditNotes} 
          severity="secondary"/>
          <Button 
          label="Cancel" 
          severity="danger" 
          className="btn-style" 
          onClick={cancelNotesSubmitButton}/>
        </div>
      </Dialog>
      <ButtonNotes deleteAllNotes={deleteAllNotes} fetchNotes={fetchNotes}/>
    </>
  )
}

export default Notes;