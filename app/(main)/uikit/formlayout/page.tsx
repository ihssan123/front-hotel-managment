'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DropdownItem {
    name: string;
    code: string;
}

const FormLayoutDemo = () => {
    const token=localStorage.getItem('accessToken');
    const[userObject,setUserObject]=useState([])
  

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user !== null) {
            setUserObject(JSON.parse(user));
        } else {
            console.log("erreur");
        }
    }, []); 
    const handleInputChange = (field: string, value: string) => {
        setUserObject(prevUserObject => ({
            ...prevUserObject,
            [field]: value
        }));
    };



    const [dropdownItem, setDropdownItem] = useState<DropdownItem | null>(null);
    const dropdownItems: DropdownItem[] = useMemo(
        () => [
            { name: 'Option 1', code: 'Option 1' },
            { name: 'Option 2', code: 'Option 2' },
            { name: 'Option 3', code: 'Option 3' }
        ],
        []
    );



    const handleSave = (id:number) => {
        const url = `http://localhost:8080/api/v1/user/${id}`;
    
        axios.put(url, userObject, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response: any) => {
            console.log(response.data);
            localStorage.setItem('user', JSON.stringify(userObject));
            toast.success('Update successful'); // Show success toast
        })
        .catch((error: any) => {
            console.error(error);
            toast.error('Update failed'); // Show error toast
        });
    };
    
       /* setDropdownItem(dropdownItems[0]);
    }, [dropdownItems]);
    
    

    useEffect(() => {
        setDropdownItem(dropdownItems[0]);
    }, [dropdownItems]); */
    

    return (
        <div className="grid ">
            <div className="col-12 md:col-6 ">
                <div className="card p-fluid">
                    <h5>Profil</h5>
                    <div className="field">
                        <label htmlFor="name1">Nom</label>
                        <InputText id="name1" type="text"  value={userObject.firstname } onChange={(e) => handleInputChange('firstname', e.target.value)}  />
                    </div>
                    <div className="field">
                        <label htmlFor="prenom1">Prènom</label>
                        <InputText id="prenom1" type="text" value={userObject.lastname } onChange={(e) => handleInputChange('lastname', e.target.value)}/>
                    </div>
                    <div className="field">
                        <label htmlFor="adresse1">Adresse</label>
                        <InputText id="adresse1" type="text" value={userObject.adresse } onChange={(e) => handleInputChange('adresse', e.target.value)}/>
                    </div>
                    <div className="field">
                        <label htmlFor="tel1">Téléphone</label>
                        <InputText id="tel1" type="text" value={userObject.phoneNumber } onChange={(e) => handleInputChange('phoneNumber', e.target.value)}/>
                    </div>
                    <div className="field">
                        <Button label="Sauvegarder" className="p-button-purple" onClick={()=>handleSave(userObject.idUser)}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormLayoutDemo;