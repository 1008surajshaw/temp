import { Form, Input, Upload, Radio, DatePicker, TimePicker, Typography } from "antd"
import { PlusOutlined, GlobalOutlined, LockOutlined } from "@ant-design/icons"
import { useRef } from "react"
import ReactQuill from 'react-quill-new'
import { EVENT_VISIBILITY } from "../../types"
import type { UploadFile } from "antd/es/upload/interface"

const { Text, Title } = Typography

interface BasicInfoStepProps {
  form: any
  coverImage: UploadFile[]
  setCoverImage: (files: UploadFile[]) => void
  description: string
  setDescription: (desc: string) => void
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
}

export default function BasicInfoStep({
  form,
  coverImage,
  setCoverImage,
  description,
  setDescription
}: BasicInfoStepProps) {
  const quillRef = useRef<any>(null)

  const handleDescriptionChange = (content: string) => {
    setDescription(content)
    form.setFieldsValue({ description: content })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Title level={4}>Let's start with the basics</Title>
        <Text type="secondary">Tell us about your event - only the essentials for now</Text>
      </div>

      {/* Avatar Upload */}
      <div className="text-center">
        <Text strong className="block mb-2">Event Cover Image</Text>
        <Upload
          listType="picture-card"
          fileList={coverImage}
          onChange={({ fileList }) => setCoverImage(fileList)}
          beforeUpload={() => false}
          maxCount={1}
          className="avatar-uploader"
        >
          {coverImage.length === 0 && (
            <div>
              <PlusOutlined />
              <div className="mt-2">Upload</div>
            </div>
          )}
        </Upload>
        <Text type="secondary" className="text-sm">Add a cover image to make your event stand out</Text>
      </div>

      {/* Required Fields */}
      <Form.Item 
        name="title" 
        label={<Text strong>Event Title *</Text>}
        rules={[{ required: true, message: "Event title is required" }]}
      >
        <Input 
          placeholder="What's your event called?" 
          size="large"
          className="rounded-lg"
        />
      </Form.Item>

      <Form.Item 
        name="description" 
        label={<Text strong>Description</Text>}
      >
        <div className="border border-gray-300 rounded-lg">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={description}
            onChange={handleDescriptionChange}
            modules={quillModules}
            placeholder="Tell people what your event is about... (optional)"
            style={{ minHeight: "100px" }}
          />
        </div>
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item 
          name="eventDate" 
          label={<Text strong>Event Date *</Text>}
          rules={[{ required: true, message: "Event date is required" }]}
        >
          <DatePicker 
            className="w-full rounded-lg" 
            size="large"
            placeholder="Select date"
          />
        </Form.Item>

        <Form.Item 
          name="startTime" 
          label={<Text strong>Start Time *</Text>}
          rules={[{ required: true, message: "Start time is required" }]}
        >
          <TimePicker 
            className="w-full rounded-lg" 
            format="HH:mm" 
            size="large"
            placeholder="Start time"
          />
        </Form.Item>
      </div>

      <Form.Item 
        name="endTime" 
        label={<Text strong>End Time *</Text>}
        rules={[{ required: true, message: "End time is required" }]}
      >
        <TimePicker 
          className="w-full rounded-lg" 
          format="HH:mm" 
          size="large"
          placeholder="End time"
        />
      </Form.Item>

      <Form.Item 
        name="visibility" 
        label={<Text strong>Who can see this event?</Text>}
        initialValue={EVENT_VISIBILITY.PUBLIC}
      >
        <Radio.Group className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <Radio value={EVENT_VISIBILITY.PUBLIC}>
                <div className="flex items-center gap-2">
                  <GlobalOutlined className="text-green-600" />
                  <div>
                    <Text strong>Public</Text>
                    <div className="text-sm text-gray-500">Anyone can find and join</div>
                  </div>
                </div>
              </Radio>
            </div>
            <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <Radio value={EVENT_VISIBILITY.PRIVATE}>
                <div className="flex items-center gap-2">
                  <LockOutlined className="text-orange-600" />
                  <div>
                    <Text strong>Private</Text>
                    <div className="text-sm text-gray-500">Invite only</div>
                  </div>
                </div>
              </Radio>
            </div>
          </div>
        </Radio.Group>
      </Form.Item>
    </div>
  )
}