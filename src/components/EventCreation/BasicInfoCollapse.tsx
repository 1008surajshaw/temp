import { Form, Input, Upload, Radio, DatePicker, TimePicker, Typography } from "antd"
import { PlusOutlined, GlobalOutlined, LockOutlined } from "@ant-design/icons"
import { useRef } from "react"
import ReactQuill from 'react-quill-new'
import { EVENT_VISIBILITY } from "../../types"
import type { UploadFile } from "antd/es/upload/interface"
import dayjs from "dayjs"

const { Text } = Typography

interface BasicInfoCollapseProps {
  form: any
  coverImage: UploadFile[]
  setCoverImage: (files: UploadFile[]) => void
  description: string
  setDescription: (desc: string) => void
}

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
}

export default function BasicInfoCollapse({
  form,
  coverImage,
  setCoverImage,
  description,
  setDescription
}: BasicInfoCollapseProps) {
  const quillRef = useRef<any>(null)

  const handleDescriptionChange = (content: string) => {
    setDescription(content)
    form.setFieldsValue({ description: content })
  }

  return (
    <div className="space-y-6">
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
              <div className="mt-2">Avatar</div>
            </div>
          )}
        </Upload>
      </div>

      <Form.Item 
        name="title" 
        label={<Text strong>Event Title *</Text>}
        rules={[{ required: true, message: "Event title is required" }]}
      >
        <Input placeholder="Enter event title" size="large" />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <div className="border border-gray-300 rounded-lg">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={description}
            onChange={handleDescriptionChange}
            modules={quillModules}
            placeholder="Event description (optional)..."
            style={{ minHeight: "100px" }}
          />
        </div>
      </Form.Item>

      <div className="space-y-4">
        <Form.Item 
          name="eventDate" 
          label={<Text strong>Event Date *</Text>}
          rules={[{ required: true, message: "Date required" }]}
        >
          <DatePicker 
            className="w-full" 
            size="large" 
            disabledDate={(current) => current && current.isBefore(dayjs().startOf('day'))}
            placeholder="Select event date"
            format="dddd, MMMM DD, YYYY"
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item 
            name="startTime" 
            label={<Text strong>Start Time *</Text>}
            rules={[{ required: true, message: "Start time required" }]}
          >
            <TimePicker 
              className="w-full" 
              format="h:mm A" 
              size="large"
              use12Hours
              placeholder="Select start time"
            />
          </Form.Item>

          <Form.Item 
            name="endTime" 
            label={<Text strong>End Time *</Text>}
            rules={[{ required: true, message: "End time required" }]}
          >
            <TimePicker 
              className="w-full" 
              format="h:mm A" 
              size="large"
              use12Hours
              placeholder="Select end time"
            />
          </Form.Item>
        </div>
      </div>

      <Form.Item 
        name="visibility" 
        label={<Text strong>Event Visibility</Text>}
        initialValue={EVENT_VISIBILITY.PUBLIC}
      >
        <Radio.Group className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all cursor-pointer">
              <Radio value={EVENT_VISIBILITY.PUBLIC} className="w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <GlobalOutlined className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <Text strong className="block">Public</Text>
                    <Text type="secondary" className="text-sm">Anyone can find and join</Text>
                  </div>
                </div>
              </Radio>
            </div>
            <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all cursor-pointer">
              <Radio value={EVENT_VISIBILITY.PRIVATE} className="w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <LockOutlined className="text-orange-600 text-lg" />
                  </div>
                  <div>
                    <Text strong className="block">Private</Text>
                    <Text type="secondary" className="text-sm">Invite only</Text>
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