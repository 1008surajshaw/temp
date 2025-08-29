import { Form, Input, Select, Tag, Upload, Avatar, Button, Switch, Typography, Divider, InputNumber, DatePicker } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { useState } from "react"
import { SCHEDULE_MODE, RECURRENCE_PATTERN, DETAIL_VIEW_MODE } from "../../types"
import type { UploadFile } from "antd/es/upload/interface"
import dayjs from "dayjs"

const { Option } = Select
const { Text } = Typography

interface Sponsor {
  name: string
  image?: string
}

interface AdvancedCollapseProps {
  formValues: any
  tags: string[]
  setTags: (tags: string[]) => void
  sponsors: Sponsor[]
  setSponsors: (sponsors: Sponsor[]) => void
  eventImages: UploadFile[]
  setEventImages: (files: UploadFile[]) => void
}

export default function AdvancedCollapse({
  formValues,
  tags,
  setTags,
  sponsors,
  setSponsors,
  eventImages,
  setEventImages
}: AdvancedCollapseProps) {
  const [tagInput, setTagInput] = useState("")
  const [sponsorName, setSponsorName] = useState("")
  const [sponsorImage, setSponsorImage] = useState<UploadFile[]>([])

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
      {/* Category */}
      <Form.Item name="category" label="Category">
        <Select placeholder="Event category" size="large">
          <Option value="business">Business</Option>
          <Option value="technology">Technology</Option>
          <Option value="education">Education</Option>
          <Option value="arts">Arts & Culture</Option>
          <Option value="music">Music</Option>
          <Option value="sports">Sports</Option>
          <Option value="food">Food & Drink</Option>
          <Option value="health">Health</Option>
        </Select>
      </Form.Item>

      {/* Tags */}
      <div>
        <Text strong className="block mb-2">Tags</Text>
        <div className="mb-3">
          {tags.map((tag) => (
            <Tag key={tag} closable onClose={() => handleRemoveTag(tag)} color="blue" className="mb-2">
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
            size="large"
          />
          <Button onClick={handleAddTag} type="dashed" size="large">Add</Button>
        </div>
      </div>

      {/* Event Images */}
      <div>
        <Text strong className="block mb-2">Event Images</Text>
        <Upload
          listType="picture-card"
          fileList={eventImages}
          onChange={({ fileList }) => setEventImages(fileList)}
          beforeUpload={() => false}
          multiple
        >
          {eventImages.length < 6 && (
            <div>
              <PlusOutlined />
              <div className="mt-2">Upload</div>
            </div>
          )}
        </Upload>
      </div>

      <Divider />

      {/* Sponsors */}
      <div>
        <Text strong className="block mb-2">Sponsors</Text>
        <div className="mb-4">
          {sponsors.map((sponsor, index) => (
            <Tag key={index} closable onClose={() => handleRemoveSponsor(index)} color="blue" className="mb-2">
              <div className="flex items-center gap-2">
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
        
        <div className="space-y-3">
          <Input
            placeholder="Sponsor name"
            value={sponsorName}
            onChange={(e) => setSponsorName(e.target.value)}
            size="large"
          />
          <div className="flex gap-3 items-end">
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
            <Button 
              onClick={handleAddSponsor} 
              type="dashed" 
              disabled={!sponsorName}
              size="large"
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Access Control */}
      <div>
        <Text strong className="block mb-4">Access Control</Text>
        
        <div className="space-y-4">
          <Form.Item name="requireRsvp" label="Require RSVP" valuePropName="checked">
            <Switch />
          </Form.Item>
          
          <Form.Item name="detailViewMode" label="Detail Visibility">
            <Select placeholder="When can people see details?" size="large">
              <Option value={DETAIL_VIEW_MODE.BEFORE}>Before Registration</Option>
              <Option value={DETAIL_VIEW_MODE.AFTER}>After Registration</Option>
              <Option value={DETAIL_VIEW_MODE.CUSTOM}>Custom</Option>
            </Select>
          </Form.Item>
        </div>
      </div>

      <Divider />

      {/* Schedule Options */}
      <div>
        <Text strong className="block mb-4">Schedule Options</Text>
        
        <div className="space-y-4">
          <Form.Item name="timezone" label="Timezone" initialValue="UTC">
            <Select placeholder="Select timezone" size="large">
              <Option value="UTC">UTC</Option>
              <Option value="America/New_York">Eastern Time (ET)</Option>
              <Option value="America/Chicago">Central Time (CT)</Option>
              <Option value="America/Los_Angeles">Pacific Time (PT)</Option>
              <Option value="Europe/London">London (GMT)</Option>
              <Option value="Asia/Tokyo">Tokyo (JST)</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="scheduleMode" label="Schedule Mode">
            <Select placeholder="Schedule type" size="large">
              <Option value={SCHEDULE_MODE.SINGLE}>Single Event</Option>
              <Option value={SCHEDULE_MODE.MULTI}>Multi-day</Option>
              <Option value={SCHEDULE_MODE.RECURRING}>Recurring</Option>
            </Select>
          </Form.Item>
          
          {formValues.scheduleMode === SCHEDULE_MODE.RECURRING && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Item name="recurrencePattern" label="Repeat">
                <Select placeholder="Pattern" size="large">
                  <Option value={RECURRENCE_PATTERN.DAILY}>Daily</Option>
                  <Option value={RECURRENCE_PATTERN.WEEKLY}>Weekly</Option>
                  <Option value={RECURRENCE_PATTERN.MONTHLY}>Monthly</Option>
                </Select>
              </Form.Item>
              
              <Form.Item name="maxOccurrences" label="Max Events">
                <InputNumber min={1} className="w-full" size="large" />
              </Form.Item>
            </div>
          )}
        </div>
      </div>

      <Divider />

      {/* Registration Settings */}
      <div>
        <Text strong className="block mb-4">Registration Settings</Text>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item name="registrationStartDate" label="Registration Opens">
            <DatePicker 
              className="w-full" 
              size="large" 
              format="MMM DD, YYYY"
              disabledDate={(current) => {
                const today = dayjs().startOf('day')
                const eventDate = formValues.eventDate ? dayjs(formValues.eventDate).startOf('day') : null
                return current && (current.isBefore(today) || (eventDate && current.isAfter(eventDate)))
              }}
              placeholder="When registration starts"
            />
          </Form.Item>
          
          <Form.Item name="registrationEndDate" label="Registration Closes">
            <DatePicker 
              className="w-full" 
              size="large" 
              format="MMM DD, YYYY"
              disabledDate={(current) => {
                const today = dayjs().startOf('day')
                const eventDate = formValues.eventDate ? dayjs(formValues.eventDate).startOf('day') : null
                const regStart = formValues.registrationStartDate ? dayjs(formValues.registrationStartDate).startOf('day') : null
                return current && (current.isBefore(today) || 
                  (eventDate && current.isAfter(eventDate)) ||
                  (regStart && current.isBefore(regStart)))
              }}
              placeholder="When registration ends"
            />
          </Form.Item>
        </div>
      </div>


    </div>
  )
}