// Import React và các thư viện cần thiết
import React, {useContext, useEffect, useState} from "react";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Dropdown } from "primereact/dropdown";
import {Image} from "primereact/image";
import {parseAst} from "vite";
import {ThemeContext} from "../../ThemeContext.tsx";

interface EditPostModalProps {
    visible: boolean;
    onHide: () => void;
    post: {
        listMedia: any;
        content: string;
        Type: any;
    };
    onSave: (data: UpdatePostModel) => void;
    toast: any;
    isShare: boolean;

}

interface UpdatePostModel {
    Medias: any[];
    Content: string;
    files:  File[];
    Status: string;

}
const maxFiles = 5;
const maxSize = 10 * 1024 * 1024; // 10MB

const EditPostModal: React.FC<EditPostModalProps> = ({isShare = false, visible, onHide, post, onSave, toast }) => {
    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const textColor = currentTheme.getText()
    const textHintColor = currentTheme.getHint()
    const captionColor = currentTheme.getCaption()
    const backgroundColor = currentTheme.getBackground()
    const cardColor = currentTheme.getCard()
    const borderColor = currentTheme.getBorder()

    const [caption, setCaption] = useState<string>(post?.content || "");

    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [status, setStatus] = useState<string>(post?.status || "Public");
    const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";

    const listStatus = [
        { name: 'Public', code: '0' },
        { name: 'Private', code: '1' },
        { name: 'Friend', code: '2' }
    ];
    // @ts-ignore
    const [selectStatus, setSelectStatus] = useState(listStatus[1]);

    const initialMedia = post?.listMedia.map((media: { id: string; mediaUrl: string; contentType: string; IsDeleted: boolean }) => ({
        id: media.id,
        mediaUrl: media.mediaUrl + token,
        contentType: media.contentType,
        isDeleted: media.IsDeleted,
    }));

    const [mediaIds, setMediaIds] = useState<any[]>(initialMedia);

    if(!post) return (<></>)
    // Đồng bộ trạng thái `selectStatus` khi modal mở hoặc khi `post` thay đổi
    useEffect(() => {
        if (visible) {
            setCaption(post.content || "");
            setNewFiles([]);

            // Tìm trạng thái mặc định dựa trên `post.status` (kiểu số)
            const defaultStatus = listStatus.find((status) => parseInt(status.code, 10) === post?.status);
            setSelectStatus(defaultStatus || listStatus[0]); // Mặc định là "Public" nếu không khớp
        }
    }, [post, visible]);


    // Remove media ID
    const removeMedia = (file: any) => {
        setMediaIds(mediaIds.filter((media) => media.id !== file.id));
        setNewFiles(newFiles.filter((f) => f !== file));
    };

    // Handle new file selection
    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (mediaIds.length + files.length > maxFiles) {
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Too Many Files',
                    detail: `You can only upload up to ${maxFiles} files.`,
                    life: 3000,
                });
                return;
            }
            const allowedFormats = ['image/jpg', 'image/jpeg', 'image/png', 'video/mp4', 'video/webp'];

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

                setNewFiles([...newFiles, ...validFiles]);

                const previewFiles = validFiles.map((file) => ({
                    id: URL.createObjectURL(file), // Temporary ID for preview
                    mediaUrl: URL.createObjectURL(file),
                    contentType: file.type,
                    isDeleted: false,
                }));
                setMediaIds([...mediaIds, ...previewFiles]);
            }
        }
    };
    const ResetMedia = () =>{
        setMediaIds(initialMedia);
        setNewFiles([])
    }
    const handleSave = () => {

        const formData = new FormData();
        newFiles.forEach((file) => formData.append("files", file));
        formData.append("Content", caption);
        formData.append("Status", selectStatus.code)
        mediaIds.forEach((media) => formData.append("Medias", media.id));

        console.log(JSON.stringify(mediaIds.map((media) => media.id)))
        onSave(formData);
        // onHide();
    };

    const statusOptions = ["Public", "Private", "Friends"];

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header="Edit Post"
            footer={
                <div style={{background: cardColor, border: `1px solid ${borderColor}`}}>
                    <Button label="Cancel" icon="pi pi-times" onClick={onHide} />
                    <Button label="Save" icon="pi pi-check" onClick={handleSave} />
                </div>
            }
            style={{ width: "500px", margin: 10, backgroundColor: cardColor }}
        >
            {/* Caption */}
            <div style={{ marginBottom: "0px" }}>
                <h5>Caption</h5>
                <InputTextarea
                    style={{minWidth: 150,maxWidth: 400, minHeight: 50, maxHeight: 200}}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={3}
                    placeholder="Edit your caption..."
                />
            </div>

            {/* Medias */}
            {!isShare && (
                <>
                    <div style={{marginBottom: "20px"}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <h5>Media </h5>
                            <Button text label="" icon="pi pi-upload"
                                    onClick={() => document.querySelector('.file-input')?.click()}/>

                            <Button text label="" icon="pi pi-refresh"
                                    onClick={ResetMedia}/>

                        </div>

                        <div style={{display: "flex", flexWrap: "wrap", gap: "10px"}}>
                            {mediaIds.map((media) => (
                                <div key={media.id} style={{position: "relative"}}>
                                    <Image
                                        preview
                                        src={`${media.mediaUrl}`}
                                        alt="Media"
                                        width="100"
                                        height="100"
                                        style={{width: "100px", height: "100px", objectFit: "cover"}}
                                    />
                                    <Button
                                        icon="pi pi-times"
                                        className="p-button-rounded p-button-danger"
                                        style={{
                                            position: "absolute",
                                            top: "-10px",
                                            right: "-10px",
                                            width: 25,
                                            height: 25
                                        }}
                                        onClick={() => removeMedia(media)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* New Uploads */}
                    <div style={{marginBottom: "20px"}}>
                        {/*<h5>Upload New Media</h5>*/}
                        {/*<FileUpload*/}
                        {/*    mode="basic"*/}
                        {/*    name="files"*/}
                        {/*    accept="image/*"*/}
                        {/*    onSelect={onFileSelect} // Handle file selection*/}
                        {/*    multiple*/}
                        {/*    chooseLabel="Choose"*/}
                        {/*/>*/}
                        <input
                            type="file"
                            accept="image/jpg,image/jpeg,image/png,video/mp4,video/webp"
                            multiple
                            onChange={onFileSelect}
                            className="file-input"
                        />

                    </div>
                </>
            )}
            {/* Status */}
            <div>
                <h5>Status</h5>
                <Dropdown style={{maxWidth: 125}} value={selectStatus} onChange={(e) => setSelectStatus(e.value)}
                          options={listStatus} optionLabel="name"
                          placeholder="Select status post" className="w-full md:w-14rem"/>
            </div>
        </Dialog>
    );
};

export default EditPostModal;
