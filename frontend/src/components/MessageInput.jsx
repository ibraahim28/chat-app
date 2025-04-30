import { Paperclip, Send, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const removeImage = () => {
    setImagePreview(null);
  };
  const handleSendMessage = async () => {
    try {
      await sendMessage({ text: text.trim(), media: imagePreview });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };
  return (
    <div className="px-4 py-2 flex flex-col justify-center items-start gap-4">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="image"
              className="w-20 h-20 object-cover rounded border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute cursor-pointer -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <div className="w-full flex gap-2 items-center">
        <div className="w-full relative">
          <input
            type="text"
            className="input input-bordered input-sm sm:input-md pl-14 py-4 w-full rounded-xl"
            placeholder="Your Message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (text.trim() || imagePreview)) {
                e.preventDefault(); // Prevent new line
                handleSendMessage();
              }
            }}
          />

          <input
            type="file"
            className="hidden"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={` ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => {
              fileInputRef.current.click();
            }}
          >
            <Paperclip
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70 cursor-pointer"
            />
          </button>
        </div>
        <div className="">
          {" "}
          <button
            className="btn btn-sm "
            disabled={!text.trim() && !imagePreview}
            onClick={handleSendMessage}
          >
            {" "}
            <Send size={18} />{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;