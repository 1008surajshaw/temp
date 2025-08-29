import { Form, Input, Radio, Tag, Upload, Avatar, Button, DatePicker, TimePicker, Typography } from "antd"
import { PlusOutlined, GlobalOutlined, LockOutlined } from "@ant-design/icons"
import { useState, useRef } from "react"
import ReactQuill from 'react-quill-new'
import { EVENT_VISIBILITY } from "../../types"
import type { UploadFile } from "antd/es/upload/interface"

const { Text } = Typography

interface Sponsor {
  name: string
  image?: string
}

interface BasicInfoFormProps {
  form: any
  description: string
  setDescription: (desc: string) => void
  tags: string[]
  setTags: (tags: string[]) => void
  sponsors: Sponsor[]
  setSponsors: (sponsors: Sponsor[]) => void
  coverImage: UploadFile[]
  setCoverImage: (files: UploadFile[]) => void
  eventImages: UploadFile[]
  setEventImages: (files: UploadFile[]) => void
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "blockquote"],
    ["clean"],
  ],
}

export default function BasicInfoForm({
  form,
  description,
  setDescription,
  tags,
  setTags,
  sponsors,
  setSponsors,
  coverImage,
  setCoverImage,
  eventImages,
  setEventImages
}: BasicInfoFormProps) {
  const [tagInput, setTagInput] = useState("")
  const [sponsorName, setSponsorName] = useState("")
  const [sponsorImage, setSponsorImage] = useState<UploadFile[]>([])
  const quillRef = useRef<any>(null)

  const handleDescriptionChange = (content: string) => {
    setDescription(content)
    form.setFieldsValue({ description: content })
  }

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleAddSponsor = () => {
    if (sponsorName) {
      const newSponsor: Sponsor = {
        name: sponsorName,
        image: sponsorImage[0]?.url || sponsorImage[0]?.thumbUrl,
      }
      setSponsors([...sponsors, newSponsor])
      setSponsorName("")
      setSponsorImage([])
    }
  }

  const handleRemoveSponsor = (index: number) => {
    setSponsors(sponsors.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div className="text-center">
        <Upload
          listType="picture-card"
          fileList={coverImage}
          onChange={({ fileList }) => setCoverImage(fileList)}
          beforeUpload={() => false}
          maxCount={1}
        >
          {coverImage.length === 0 && (
            <div>
              <PlusOutlined />
              <div className="mt-2">Upload Cover</div>
            </div>
          )}
        </Upload>
        <Text type="secondary">Upload event cover image</Text>
      </div>

      {/* Required Fields */}
      <Form.Item name="title" label="Event Title" rules={[{ required: true, message: "Title is required" }]}>
        <Input placeholder="Enter event title" size="large" />
      </Form.Item>

      <Form.Item name="description" label="Description" rules={[{ required: true, message: "Description is required" }]}>
        <div className="border border-gray-300 rounded-lg">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={description}
            onChange={handleDescriptionChange}
            modules={quillModules}
            placeholder="Event description..."
            style={{ minHeight: "120px" }}
          />
        </div>
      </Form.Item>

      <Form.Item name="eventDate" label="Event Date" rules={[{ required: true, message: "Date is required" }]}>
        <DatePicker className="w-full" />
      </Form.Item>

      <Form.Item name="startTime" label="Start Time" rules={[{ required: true, message: "Start time is required" }]}>
        <TimePicker className="w-full" format="HH:mm" />
      </Form.Item>

      <Form.Item name="endTime" label="End Time" rules={[{ required: true, message: "End time is required" }]}>
        <TimePicker className="w-full" format="HH:mm" />
      </Form.Item>

      <Form.Item name="visibility" label="Visibility" initialValue={EVENT_VISIBILITY.PUBLIC}>
        <Radio.Group>
          <Radio.Button value={EVENT_VISIBILITY.PUBLIC}>
            <GlobalOutlined /> Public
          </Radio.Button>
          <Radio.Button value={EVENT_VISIBILITY.PRIVATE}>
            <LockOutlined /> Private
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      {/* Tags */}
      <div>
        <Text strong>Tags</Text>
        <div className="mt-2 mb-2">
          {tags.map((tag) => (
            <Tag key={tag} closable onClose={() => handleRemoveTag(tag)} color="blue">
              {tag}
            </Tag>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onPressEnter={handleAddTag}
          />
          <Button onClick={handleAddTag} type="dashed">Add</Button>
        </div>
      </div>

      {/* Sponsors */}
      <div>
        <Text strong>Sponsors</Text>
        <div className="mt-2 mb-2">
          {sponsors.map((sponsor, index) => (
            <Tag key={index} closable onClose={() => handleRemoveSponsor(index)} color="blue" className="mb-2">
              <div className="flex items-center gap-1">
                {sponsor.image ? (
                  <Avatar size="small" src={sponsor.image} />
                ) : (
                  <Avatar size="small" style={{ backgroundColor: "#1890ff" }}>
                    {sponsor.name.charAt(0).toUpperCase()}
                  </Avatar>
                )}
                {sponsor.name}
              </div>
            </Tag>
          ))}
        </div>
        <div className="space-y-2">
          <Input
            placeholder="Sponsor name"
            value={sponsorName}
            onChange={(e) => setSponsorName(e.target.value)}
          />
          <div className="flex gap-2 items-end">
            <Upload
              listType="picture-card"
              fileList={sponsorImage}
              onChange={({ fileList }) => setSponsorImage(fileList)}
              beforeUpload={() => false}
              maxCount={1}
            >
              {sponsorImage.length === 0 && (
                <div>
                  <PlusOutlined />
                  <div className="mt-1 text-xs">Logo</div>
                </div>
              )}
            </Upload>
            <Button onClick={handleAddSponsor} type="dashed" disabled={!sponsorName}>
              Add Sponsor
            </Button>
          </div>
        </div>
      </div>

      {/* Event Images */}
      <div>
        <Text strong>Event Images</Text>
        <Upload
          listType="picture-card"
          fileList={eventImages}
          onChange={({ fileList }) => setEventImages(fileList)}
          beforeUpload={() => false}
          multiple
        >
          {eventImages.length < 8 && (
            <div>
              <PlusOutlined />
              <div className="mt-2">Upload</div>
            </div>
          )}
        </Upload>
      </div>
    </div>
  )
}