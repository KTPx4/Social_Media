import React, {useContext, useRef, useState} from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Galleria } from "primereact/galleria";

import "./CreatePostModal.css";
import {ThemeContext} from "../../ThemeContext.tsx";
import {Dropdown} from "primereact/dropdown";
import apiClient from "../../utils/apiClient.tsx";
import { Toast } from 'primereact/toast';
interface CreatePostModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}
const maxFiles = 5;
const CreatePostModal: React.FC<CreatePostModalProps> = ({ visible, setVisible }) => {
    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const textColor = currentTheme.getText()
    const backgroundColor = currentTheme.getBackground()

    const [activeStep, setActiveStep] = useState(1); // Step 1: Upload, Step 2: Preview, Step 3: Caption
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [caption, setCaption] = useState("");

    const listStatus = [
        { name: 'Public', code: '0' },
        { name: 'Private', code: '1' },
        { name: 'Friend', code: '2' }
    ];
    const [selectStatus, setSelectStatus] = useState(listStatus[0]);

    const toast = useRef<Toast>(null);

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (selectedFiles.length + files.length > maxFiles) {
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Too Many Files',
                    detail: `You can only upload up to ${maxFiles} files.`,
                    life: 3000,
                });
                return;
            }
            const allowedFormats = ['image/jpg', 'image/jpeg', 'image/png', 'video/mp4', 'video/webp'];
            const maxSize = 10 * 1024 * 1024; // 10MB

            const validFiles = files.filter((file) => {
                if (!allowedFormats.includes(file.type)) {
                    toast.current?.show({ severity: 'warn', summary: 'Invalid Format', detail: `Unsupported file format: ${file.type}`, life: 3000 });
                    return false;
                }
                if (file.size > maxSize) {
                    toast.current?.show({ severity: 'warn', summary: 'File Too Large', detail: `${file.name} exceeds the 10MB limit`, life: 3000 });
                    return false;
                }
                return true;
            });

            if (validFiles.length > 0) {
                setSelectedFiles( [  ...validFiles]);
                setActiveStep(2); // Chuyển sang bước preview
            }
        }
    };

    const showSuccess = () => {
        toast.current?.show({severity:'success', summary: 'Success', detail:'Create post success', life: 3000});
    }
    const showError = (err:any) => {
        toast.current?.show({severity:'error', summary: 'Error', detail: err, life: 3000});
    }
    const nextStep = async () => {
        if (activeStep === 2) setActiveStep(3);
        if(activeStep === 3)
        {
            await submitPost()
        }
    };

    const submitPost = async () => {

        if (!caption.trim()) {
            alert("Please add a caption.");
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("files", file));
        formData.append("Content", caption);
        formData.append("Status", selectStatus.code)
        // status
        console.log("FormData:", formData)
        try {

            const data = await apiClient.post("/post", formData);

            console.log("rs: ",data)

            var code = data.status
            var rsData = data.data

            var mess = rsData.message
            if(code === 200 || code === 201)
            {
                var postId = rsData.data.id
                showSuccess()
                setVisible(false)

                setTimeout(()=>{
                    window.location.href = `/post/${postId}`
                }, 2000)
            }
            else{
                showError(mess)
            }


        } catch (error) {
            console.error("Error submitting post:", error);
            alert("An error occurred while creating the post.");
        }
    };


    const itemTemplate = (item: File) => {
        if (item.type.startsWith("image/")) {
            return <img src={URL.createObjectURL(item)} alt={item.name} style={{ width: "100%" }} />;
        }
        if (item.type.startsWith("video/")) {
            return (
                <video controls style={{ width: "100%" }} key={item.name}>
                    <source src={URL.createObjectURL(item)} type={item.type} />
                    Your browser does not support the video tag.
                </video>
            );
        }
        return null;
    };
    const thumbnailTemplate = (item: File) => {
        if (item.type.startsWith("image/")) {
            return <img src={URL.createObjectURL(item)} alt={item.name} style={{ width: "100%" }} />;
        }
        if (item.type.startsWith("video/")) {
            return (
                <video
                    style={{ width: "100%", objectFit: "cover" }}
                    muted
                    key={item.name}
                >
                    <source src={URL.createObjectURL(item)} type={item.type} />
                </video>
            );
        }
        return null;
    };


    return (
        <>
            <Toast ref={toast} />
            <Dialog

                style={{ maxWidth: 500 , backgroundColor: backgroundColor, color: textColor, overflow: "auto", padding: 5}}
                header="Create New Post"
                visible={visible}
                onHide={() => setVisible(false)}
                className="create-post-dialog"
            >
                {activeStep === 1 && (
                    <div className="step step-upload">
                        <div className="drag-area">
                            <input
                                type="file"
                                accept="image/jpg,image/jpeg,image/png,video/mp4,video/webp"
                                multiple
                                onChange={onFileSelect}
                                className="file-input"
                            />
                            <p>Drag photos and videos here</p>
                            {/*@ts-ignore*/}
                            <Button label="Select from computer" icon="pi pi-upload" onClick={() => document.querySelector('.file-input')?.click()} />
                        </div>
                    </div>
                )}
                <div style={{
                    display: "flex",
                    flexDirection: "row"
                }}>

                    {activeStep >= 2 && selectedFiles.length > 0 && (
                        <div className="step step-preview">
                            <Galleria
                                value={selectedFiles}
                                item={itemTemplate}
                                thumbnail={thumbnailTemplate} // Thêm thumbnailTemplate để hiển thị video đúng ở indicators
                                style={{ maxWidth: "400px" }}
                                showThumbnails={true} // Nếu muốn hiện thumbnails
                                showIndicators={true} // Đảm bảo indicators được bật
                                indicatorsPosition="bottom" // Vị trí indicators (nếu cần)
                                circular // Cho phép chuyển vòng lặp giữa các mục
                            />
                            <div className="step-actions" style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-evenly"
                            }}>
                                <Button rounded text label="Back"   onClick={() => setActiveStep(1)}/>
                                <Button rounded text label="Next"   onClick={nextStep}/>
                            </div>
                        </div>
                    )}
                    {activeStep === 3 && (
                        <div className="step step-caption">
                            <h3>Add a Caption</h3>
                            <InputTextarea
                                style={{backgroundColor: "transparent"}}
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                rows={5}
                                cols={20}
                                placeholder="Write a caption..."
                            />
                            <h3>Status</h3>
                            <Dropdown   value={selectStatus} onChange={(e) => setSelectStatus(e.value)} options={listStatus} optionLabel="name"
                                      placeholder="Select status post" className="w-full md:w-14rem" />
                        </div>

                    )}
                </div>
            </Dialog>
        </>
    );
};

export default CreatePostModal;
