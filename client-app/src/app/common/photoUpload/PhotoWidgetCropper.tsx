import React from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

interface IProps {
  setImage: (file: Blob) => void;
  imagePreview: string;
}

const PhotoWidgetCropper: React.FC<IProps> = ({ setImage, imagePreview }) => {
  let cropper: any = null;

  const setCropper = (instance: any) => {
    cropper = instance;
  };

  //const [cropper, setCropper] = useState<any>();

  const cropImage = () => {
    if (cropper && typeof cropper.getCroppedCanvas() === "undefined") {
      return;
    }

    cropper &&
      cropper.getCroppedCanvas().toBlob((blob: any) => {
        setImage(blob);
      }, "image/jpeg");
  };

  return (
    <Cropper
      src={imagePreview}
      style={{ height: 200, width: "100%" }}
      preview=".img-preview"
      initialAspectRatio={1}
      aspectRatio={1}
      guides={false}
      viewMode={1}
      dragMode="move"
      scalable={true}
      cropBoxMovable={true}
      cropBoxResizable={true}
      crop={cropImage}
      onInitialized={(instance) => {
        setCropper(instance);
      }}
    />
  );
};

export default PhotoWidgetCropper
