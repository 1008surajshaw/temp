import { Form, Input, Select, Tag, Upload, Avatar, Button, Radio, InputNumber, Typography, Divider } from "antd"
import { PlusOutlined, DollarOutlined, GiftOutlined } from "@ant-design/icons"
import { useState } from "react"
import { EVENT_TYPE } from "../../types"
import type { UploadFile } from "antd/es/upload/interface"

const { Option } = Select
const { Text, Title } = Typography

interface Sponsor {
  name: string
  image?: string
}

interface EnhanceStepProps {
  form: any
  tags: string[]
  setTags: (tags: string[]) => void
  sponsors: Sponsor[]
  setSponsors: (sponsors: Sponsor[]) => void
  eventImages: UploadFile[]
  setEventImages: (files: UploadFile[]) => void
  eventType: EVENT_TYPE
  setEventType: (type: EVENT_TYPE) => void
}

export default function EnhanceStep({
  form: _form,
  tags,
  setTags,
  sponsors,
  setSponsors,
  eventImages,
  setEventImages,
  eventType,
  setEventType
}: EnhanceStepProps) {
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
    <div className="space-y-8">
      <div className="text-center mb-6">
        <Title level={4}>Improve your event by adding a few more sections</Title>
        <Text type="secondary">These optional details will help your event stand out</Text>
      </div>

      {/* Category */}
      <div>
        <Text strong className="block mb-2">Category</Text>
        <Form.Item name="category">
          <Select placeholder="What type of event is this?" size="large">
            <Option value="business">Business & Professional</Option>
            <Option value="technology">Technology</Option>
            <Option value="education">Education & Learning</Option>
            <Option value="arts">Arts & Culture</Option>
            <Option value="music">Music & Entertainment</Option>
            <Option value="sports">Sports & Fitness</Option>
            <Option value="food">Food & Drink</Option>
            <Option value="health">Health & Wellness</Option>
            <Option value="community">Community & Social</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>
      </div>

      {/* Tags */}
      <div>
        <Text strong className="block mb-2">Tags</Text>
        <Text type="secondary" className="block mb-3">Help people discover your event</Text>
        <div className="mb-3">
          {tags.map((tag) => (
            <Tag key={tag} closable onClose={() => handleRemoveTag(tag)} color="blue" className="mb-2">
              {tag}
            </Tag>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add tags (e.g., networking, workshop, beginner-friendly)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onPressEnter={handleAddTag}
            size="large"
          />
          <Button onClick={handleAddTag} type="dashed" size="large">
            Add
          </Button>
        </div>
      </div>

      {/* Event Images */}
      <div>
        <Text strong className="block mb-2">Event Images</Text>
        <Text type="secondary" className="block mb-3">Add photos to showcase your event</Text>
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

      {/* Pricing */}
      <div>
        <Text strong className="block mb-4">Pricing</Text>
        <Radio.Group 
          value={eventType} 
          onChange={(e) => setEventType(e.target.value)} 
          className="w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`border-2 rounded-lg p-4 transition-colors ${
              eventType === EVENT_TYPE.FREE ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <Radio value={EVENT_TYPE.FREE}>
                <div className="flex items-center gap-3">
                  <GiftOutlined className="text-green-600 text-lg" />
                  <div>
                    <Text strong>Free Event</Text>
                    <div className="text-sm text-gray-500">No charge for attendance</div>
                  </div>
                </div>
              </Radio>
            </div>
            
            <div className={`border-2 rounded-lg p-4 transition-colors ${
              eventType === EVENT_TYPE.PAID ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <Radio value={EVENT_TYPE.PAID}>
                <div className="flex items-center gap-3">
                  <DollarOutlined className="text-blue-600 text-lg" />
                  <div>
                    <Text strong>Paid Event</Text>
                    <div className="text-sm text-gray-500">Charge for tickets</div>
                  </div>
                </div>
              </Radio>
            </div>
          </div>
        </Radio.Group>

        {eventType === EVENT_TYPE.PAID && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item 
              name="price" 
              label="Ticket Price ($)"
              rules={[{ required: true, message: "Price is required for paid events" }]}
            >
              <InputNumber 
                className="w-full" 
                placeholder="25.00" 
                min={0} 
                size="large"
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => parseFloat(value!.replace(/\$\s?|(,*)/g, '')) as any}
              />
            </Form.Item>
            
            <Form.Item name="capacity" label="Available Tickets">
              <InputNumber 
                className="w-full" 
                placeholder="100" 
                min={1} 
                size="large"
              />
            </Form.Item>
          </div>
        )}

        {eventType === EVENT_TYPE.FREE && (
          <div className="mt-4">
            <Form.Item name="registrationLimit" label="Registration Limit (Optional)">
              <InputNumber 
                className="w-full" 
                placeholder="Leave empty for unlimited" 
                min={1} 
                size="large"
              />
            </Form.Item>
          </div>
        )}
      </div>

      <Divider />

      {/* Sponsors */}
      <div>
        <Text strong className="block mb-2">Sponsors</Text>
        <Text type="secondary" className="block mb-3">Add companies or organizations sponsoring your event</Text>
        
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
            placeholder="Sponsor company name"
            value={sponsorName}
            onChange={(e) => setSponsorName(e.target.value)}
            size="large"
          />
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Text className="block mb-2">Logo (Optional)</Text>
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
            </div>
            <Button 
              onClick={handleAddSponsor} 
              type="dashed" 
              disabled={!sponsorName}
              size="large"
              className="mb-2"
            >
              Add Sponsor
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}