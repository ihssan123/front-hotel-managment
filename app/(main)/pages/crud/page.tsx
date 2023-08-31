/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { MultiSelect } from 'primereact/multiselect';

import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../../demo/service/ProductService';
import { Demo } from '../../../../types/types';
import axios from 'axios';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    let emptyProduct: Demo.Product = {
        id: '',
        name: '',
        image: '',
        description: '',
        category: '',
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK'
    };
    let emptyCabin: Demo.Cabin = {
        name: '',
        capacite: 0,
        price: 0,
        descreption: '',
        typecabin: '',
        discount: 0,
        surface: 0,
        basicFeatures: '',
        bedroomFeatures: '',
        livingRoomFeatures: '',
        kitchenFeatures: '',
        bathroomFeatures: '',
        additionalFeatures: ''
    };



    let emptyCabinAff: Demo.CabinAff = {
        idcabin: 0,
        name: '',
        capacite: 0,
        price: 0,
        descreption: '',
        typecabin: '',
        discount: 0,
        surface: 0,
        basicFeatures: '',
        bedroomFeatures: '',
        livingRoomFeatures: '',
        kitchenFeatures: '',
        bathroomFeatures: '',
        additionalFeatures: '',
        imageFile: null,
    };

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [cabins, setCabins] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [selectedCabins, setSelectedCabins] = useState<Demo.CabinAff[]>([]);
    const [editDialog, setEditDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [cabin, setCabin] = useState<Demo.Cabin>(emptyCabin);
    const [cabinaff, setCabinAff] = useState<Demo.CabinAff>(emptyCabinAff);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/cabins/open/getallCabins');
                setCabins(response.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    // const [selectedBasicFeatures, setSelectedBasicFeatures] = useState('');

    const handleBasicFeaturesChange = (e) => {
        const val = (e.target && e.target.value) || '';
        console.log("valeur est :" + val);
        let _cabin = { ...cabin };
        _cabin[`basicFeatures`] = val;
        setCabin(_cabin);
    };
    const handleBedroomAmenitiesChange = (e) => {
        const val = (e.target && e.target.value) || '';
        console.log("valeur est :" + val);
        let _cabin = { ...cabin };
        _cabin[`bedroomFeatures`] = val;

        setCabin(_cabin);
    };
    const handleKitchenEquipmentChange = (e) => {
        const val = (e.target && e.target.value) || '';
        console.log("valeur est :" + val);
        let _cabin = { ...cabin };
        _cabin[`kitchenFeatures`] = val;
        setCabin(_cabin);
    };
    const handleToiletryItemsChange = (e) => {
        const val = (e.target && e.target.value) || '';
        console.log("valeur est :" + val);
        let _cabin = { ...cabin };
        _cabin[`bathroomFeatures`] = val;
        setCabin(_cabin);
    };
    const handleAdditionalAmenitiesChange = (e) => {
        const val = (e.target && e.target.value) || '';
        console.log("valeur est :" + val);
        let _cabin = { ...cabin };
        _cabin[`additionalFeatures`] = val;
        setCabin(_cabin);
    };
    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };
    // const onUpload = (event: any) => {


    //     const uploadedFile = event.files[0];
    //     setSelectedImage(uploadedFile);

    //     // Log selected image properties
    //     console.log("Selected Image:", selectedImage);

    //     toast.current?.show({
    //         severity: 'info',
    //         summary: 'Success',
    //         detail: 'File Uploaded',
    //         life: 3000
    //     });
    // };
    const onFileSelect = (event: any) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };
  
    // Rest of your code...

    const saveProduct = () => {
        setSubmitted(true);

        if (cabin.name.trim() && selectedImage) {
            const formData = new FormData();
            formData.append('cabinImage', selectedImage);
            formData.append('cabin', JSON.stringify(cabin));
            const token = localStorage.getItem('accessToken');

            // Set headers with authorization token
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            };

            axios.post('http://localhost:8080/api/v1/cabins/add', formData, { headers })
                .then(response => {
                    setProductDialog(false);
                    setCabin(emptyCabin);
                    setSelectedImage(null);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Cabin Saved',
                        life: 3000
                    });
                })
                .catch(error => {
                    console.error('Error saving product:', error);
                });
        } else {
            // Handle case where selectedImage is null or not a valid image
            console.error('Selected image is not valid');
        }
    };


    // Rest of your code...


    const openNew = () => {
        setCabin(emptyCabin);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        setSelectedCabins([]);
        setEditDialog(false);
    };
    const hideDialogedit = () => {
        setSubmitted(false);
        setEditDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {

        setDeleteProductsDialog(false);
    };

    /* const saveProduct = () => {
         setSubmitted(true);
 
         if (cabin.name.trim()) {
             let _cabins = [...(cabins as any)];
             let _cabin = { ...cabin };
             if (cabin.idcabin) {
             //    const index = findIndexById(cabin.idcabin);
 
               //  _idcabins[index] = _idcabin;
                 toast.current?.show({
                     severity: 'success',
                     summary: 'Successful',
                     detail: 'Cabin Updated',
                     life: 3000
                 });
             } else {
                // _cabin.idcabin = createId();
                // _cabin.image = 'product-placeholder.svg';
                 _cabins.push(_cabin);
                 toast.current?.show({
                     severity: 'success',
                     summary: 'Successful',
                     detail: 'Product Created',
                     life: 3000
                 });
             }
 
             setCabins(_cabins as any);
             setProductDialog(false);
             setCabin(emptyCabin);
         }
     };*/

    const editCabin = (cabin: Demo.CabinAff) => {
        setCabinAff({ ...cabin });
        setEditDialog(true);
    };

    // const confirmDeleteCabin = (cabin: Demo.CabinAff) => {
    //     setCabinAff(cabin);
    //     setDeleteProductDialog(true);
    // };

    // const deleteProduct = () => {

    //     let _cabins = (cabins as any)?.filter((val: any) => val.id !== cabinaff.idcabin);
    //     console.log(cabinaff.idcabin);
    //     setCabins(_cabins);
    //     setDeleteProductDialog(false);
    //     setCabin(emptyCabin);
    //     toast.current?.show({
    //         severity: 'success',
    //         summary: 'Successful',
    //         detail: 'Product Deleted',
    //         life: 3000
    //     });
    // };

    const confirmDeleteCabin = (cabin: Demo.CabinAff) => {
        setCabinAff(cabin);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        const token = localStorage.getItem('accessToken');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        };

        axios.delete(`http://localhost:8080/api/v1/cabins/delete/${cabinaff.idcabin}`, { headers })
            .then(response => {
                setDeleteProductDialog(false);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Cabin Deleted',
                    life: 3000
                });
                window.location.href = window.location.href;
            })
            .catch(error => {
                console.error('Error deleting cabin:', error);
            });
    };




    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    /* const deleteSelectedProducts = () => {
         let _cabins = (cabins as any)?.filter((val: any) => !(selectedCabins as any)?.includes(val));
         setCabins(_cabins);
         setDeleteProductsDialog(false);
         setSelectedProducts(null);
         
         toast.current?.show({
             severity: 'success',
             summary: 'Successful',
             detail: 'Products Deleted',
             life: 3000
         });
     };*/
    const deleteSelectedCabins = () => {
        const selectedCabinsIds = selectedCabins.map(cabin => cabin.idcabin);
        const token = localStorage.getItem('accessToken');

        // Set headers with authorization token
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        };

        // Use Promise.all to create an array of delete requests
        const deleteRequests = selectedCabinsIds.map(id => {
            return axios.delete(`http://localhost:8080/api/v1/cabins/delete/${id}`, { headers });
        });

        Promise.all(deleteRequests)
            .then(responses => {
                setDeleteProductsDialog(false);
                setSelectedCabins([]);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Cabins Deleted',
                    life: 3000
                });
                window.location.href = window.location.href;
            })
            .catch(error => {
                console.error('Error deleting cabins:', error);
            });
    };



    // const onCategoryChange = (e: RadioButtonChangeEvent) => {
    //     let _cabin = { ...cabin};
    //     _cabin['category'] = e.value;
    //     setCabin(_cabin);
    // };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        console.log("valeur est :" + val);
        let _cabin = { ...cabin };
        _cabin[`${name}`] = val;
        setCabin(_cabin);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _cabin = { ...cabin };
        _cabin[`${name}`] = val;
        setCabin(_cabin);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Ajouter" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Supprimer" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedCabins || !(selectedCabins as any).length} />
                </div>
            </React.Fragment>
        );
    };


    const codeBodyTemplate = (rowData: Demo.CabinAff) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.idcabin}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Demo.CabinAff) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const imageBodyTemplate = (rowData: Demo.CabinAff) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`data:image/jpeg;base64,${rowData.imageFile}`} className="shadow-2" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData: Demo.CabinAff) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price as number)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData: Demo.CabinAff) => {
        return (
            <>
                <span className="p-column-title">Capacite</span>
                {rowData.capacite}
            </>
        );
    };

    const ratingBodyTemplate = (rowData: Demo.CabinAff) => {
        return (
            <>
                <span className="p-column-title">Descreption</span>
                {rowData.descreption}
            </>
        );
    };

    // const statusBodyTemplate = (rowData: Demo.Cabin) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Status</span>
    //             <span className={`product-badge status-${rowData.inventoryStatus?.toLowerCase()}`}>{rowData.inventoryStatus}</span>
    //         </>
    //     );
    // };

    const actionBodyTemplate = (rowData: Demo.CabinAff) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editCabin(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteCabin(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Products</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );
    const EditedCabin = () => {
        setSubmitted(true);

        if (cabinaff.name.trim()) {
            const token = localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            axios.put(`http://localhost:8080/api/v1/cabins/update/${cabinaff.idcabin}`, cabinaff, { headers })
                .then(response => {
                    setEditDialog(false);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Cabin Updated',
                        life: 3000
                    });
                    window.location.href = window.location.href;
                })
                .catch(error => {
                    console.error('Error updating cabin:', error);
                });
        } else {
            console.error('Invalid cabin details');
        }
    };

    const EditDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={EditedCabin} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedCabins} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={" "}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={cabins}
                        selection={selectedCabins}
                        onSelectionChange={(e) => setSelectedCabins(e.value)}
                        dataKey="idcabin"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="description" header="Description" sortable body={ratingBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Nom" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Image" body={imageBodyTemplate}></Column>
                        <Column field="price" header="Prix" body={priceBodyTemplate} sortable></Column>
                        <Column field="capacite" header="Capacite" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        {/* <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable></Column>
                        <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>*/}
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Details Du Chambre" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nom</label>
                            <InputText
                                id="name"
                                value={cabin.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !cabin.name
                                })}
                            />
                            {submitted && !cabin.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={cabin.descreption} onChange={(e) => onInputChange(e, 'descreption')} required rows={3} cols={20} />
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="surface">Surface</label>
                                <InputNumber id="surface" value={cabinaff.surface} onValueChange={(e) => onInputNumberChange(e, 'surface')} />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Capacite</label>
                                <InputNumber id="quantity" value={cabinaff.capacite} onValueChange={(e) => onInputNumberChange(e, 'capacite')} />
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Prix</label>
                                <InputNumber id="price" value={cabin.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div className="field col">
                                <label htmlFor="discount">Discount</label>
                                <InputNumber id="discount" value={cabin.discount} onValueChange={(e) => onInputNumberChange(e, 'discount')} />
                            </div>
                        </div>


                        <div className="field">
                            <label>Caractéristiques de base:</label>
                            <MultiSelect
                                id="basicFeatures"
                                value={cabin.basicFeatures}
                                options={[
                                    'Climatisation',
                                    'Chauffage',
                                    'Wi-Fi',
                                    'Télévision par câble'
                                ]}
                                onChange={handleBasicFeaturesChange}
                            />
                        </div>
                        <div className="field">
                            <label>Commodités de la chambre:</label>
                            <MultiSelect
                                id="bedroomAmenities"
                                value={cabin.bedroomFeatures}
                                options={[
                                    'Grand lit double',
                                    'Lits',
                                    'Placard'
                                ]}
                                onChange={handleBedroomAmenitiesChange}
                            />
                        </div>
                        <div className="field">
                            <label>Équipements de cuisine:</label>
                            <MultiSelect
                                id="kitchenEquipment"
                                value={cabin.kitchenFeatures}
                                options={[
                                    'Réfrigérateur',
                                    'Micro-ondes',
                                    'Four',
                                    'Bouilloire électrique',
                                    'Cafetière',
                                    'Grille-pain',
                                    'Ustensiles',
                                    'Table à manger'
                                ]}
                                onChange={handleKitchenEquipmentChange}
                            />
                        </div>
                        <div className="field">
                            <label>Articles de toilette:</label>
                            <MultiSelect
                                id="toiletryItems"
                                value={cabin.bathroomFeatures}
                                options={[
                                    'Douche',
                                    'Serviettes',
                                    'Toilette'
                                ]}
                                onChange={handleToiletryItemsChange}
                            />
                        </div>
                        <div className="field">
                            <label>Commodités supplémentaires:</label>
                            <MultiSelect
                                id="additionalAmenities"
                                value={cabin.additionalFeatures}
                                options={[
                                    'Balcon avec vue sur la mer',
                                    'Terrasse',
                                    'Vue sur la piscine',
                                    'Jacuzzi'
                                ]}
                                onChange={handleAdditionalAmenitiesChange}
                            />
                        </div>
                        <div className="field">
                            <label>Image:</label>

                            <FileUpload
                                name="file"
                                chooseLabel="Choose"
                                uploadLabel="Upload"
                                cancelLabel="Cancel"
                                customUpload
                                uploadHandler={onFileSelect}
                            />

                        </div>
                    </Dialog>
                    <Dialog visible={editDialog} style={{ width: '450px' }} header="Modifer Chambre" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialogedit}>
                        {cabinaff.imageFile && <img src={`data:image/jpeg;base64,${cabinaff.imageFile}`} alt={cabinaff.name} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Nom</label>
                            <InputText
                                id="name"
                                value={cabinaff.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !cabinaff.name
                                })}
                            />
                            {submitted && !cabinaff.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={cabinaff.descreption} onChange={(e) => onInputChange(e, 'descreption')} required rows={3} cols={20} />
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="surface">Surface</label>
                                <InputNumber id="surface" value={cabinaff.surface} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Capacite</label>
                                <InputNumber id="quantity" value={cabinaff.capacite} onValueChange={(e) => onInputNumberChange(e, 'capacite')} />
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Prix</label>
                                <InputNumber id="price" value={cabinaff.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div className="field col">
                                <label htmlFor="discount">Discount</label>
                                <InputNumber id="discount" value={cabinaff.discount} onValueChange={(e) => onInputNumberChange(e, 'capacite')} />
                            </div>
                        </div>


                    </Dialog>
                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {cabinaff && (
                                <span>
                                    Are you sure you want to delete <b>{cabinaff.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {cabins && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
