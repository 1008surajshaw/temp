"use client"

import { useState, useEffect } from "react"
import { Form, Button, Collapse, Row, Col, Typography, message } from "antd"
import { UserOutlined, EnvironmentOutlined, DollarOutlined, SettingOutlined } from "@ant-design/icons"
import type { UploadFile } from "antd/es/upload/interface"
import 'react-quill-new/dist/quill.snow.css';
import {
  type EventsDto,
  EVENT_FORMAT,
  SCHEDULE_MODE,
  EVENT_STATUS,
  EVENT_VISIBILITY,
  EVENT_TYPE,
  REFUND_STRATEGY,
  DETAIL_VIEW_MODE,
  RECURRENCE_PATTERN,
} from "../types"
import BasicInfoCollapse from "../components/EventCreation/BasicInfoCollapse"
import LocationCollapse from "../components/EventCreation/LocationCollapse"
import PricingCollapse from "../components/EventCreation/PricingCollapse"
import AdvancedCollapse from "../components/EventCreation/AdvancedCollapse"
import CancellationPolicyCollapse from "../components/EventCreation/CancellationPolicyCollapse"
import SaveSuccessModal from "../components/EventCreation/SaveSuccessModal"
import PublishConfirmModal from "../components/EventCreation/PublishConfirmModal"
import LivePreview from "../components/EventCreation/LivePreview"

const { Title, Text } = Typography

interface Sponsor {
  name: string
  image?: string
}

export default function Creation() {
  const [form] = Form.useForm()
  const [formValues, setFormValues] = useState<any>({})
  const [coverImage, setCoverImage] = useState<UploadFile[]>([])
  const [eventImages, setEventImages] = useState<UploadFile[]>([])
  const [eventFormat, setEventFormat] = useState<EVENT_FORMAT>(EVENT_FORMAT.PHYSICAL)
  const [eventType, setEventType] = useState<EVENT_TYPE>(EVENT_TYPE.FREE)
  const [tags, setTags] = useState<string[]>([])
  const [description, setDescription] = useState("")
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [canSave, setCanSave] = useState(false)
  const [hasAnyContent, setHasAnyContent] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [savedEventStatus, setSavedEventStatus] = useState('')

  const handleFormChange = (_changedValues: any, allValues: any) => {
    setFormValues(allValues)
  }

  // Check if required fields are filled
  useEffect(() => {
    const hasBasicInfo = formValues.title && formValues.eventDate && formValues.startTime && formValues.endTime
    const hasLocation = eventFormat === EVENT_FORMAT.VIRTUAL 
      ? formValues.virtualUrl 
      : eventFormat === EVENT_FORMAT.PHYSICAL 
        ? formValues.address && formValues.city
        : formValues.virtualUrl && formValues.address && formValues.city
    
    const hasContent = formValues.title || description || tags.length > 0 || coverImage.length > 0 || 
                      formValues.eventDate || formValues.category || sponsors.length > 0
    
    setCanSave(hasBasicInfo && hasLocation)
    setHasAnyContent(hasContent)
  }, [formValues, eventFormat, description, tags, coverImage, sponsors])

  const handleSave = async (status: EVENT_STATUS) => {
    try {
      const values = await form.validateFields()
      const eventStatus = status
      const eventData: Partial<EventsDto> = {
        title: values.title,
        description: description || "",
        slug: values.title?.toLowerCase().replace(/\s+/g, "-"),
        avatar: coverImage[0]?.url || "",
        category: values.category || "general",
        images: eventImages.map((img) => img.url || ""),
        tags: tags,
        status: eventStatus,

        creator: "current-user-id",
        host: "current-user-id",
        property: "default-property",
        sponsors: sponsors,
        schedule: {
          mode: values.scheduleMode || SCHEDULE_MODE.SINGLE,
          start_time: values.eventDate?.toDate(),
          end_time: values.eventDate?.toDate(),
          registration_start_time: values.registrationStartDate?.toDate() || values.eventDate?.toDate(),
          registration_end_time: values.registrationEndDate?.toDate() || values.eventDate?.toDate(),
          timezone: values.timezone || "UTC",
          recurrence: {
            pattern: values.recurrencePattern || RECURRENCE_PATTERN.DAILY,
            interval: values.recurrenceInterval || 1,
            current_occurences: 0,
            max_occurences: values.maxOccurrences || 1,
          },
        },
        visibility: values.visibility || EVENT_VISIBILITY.PUBLIC,
        ticketing: {
          enabled: eventType === EVENT_TYPE.PAID,
          capacity: values.capacity || 100,
        },
        hosting: {
          format: eventFormat,
          address: {
            street: values.address || "",
            city: values.city || "",
            state: values.state || "",
            postal_code: values.postalCode || "",
            country: values.country || "",
            vanue: values.venue || "",
            maps_link: "",
            nearby_landmark: "",
            instruction: "",
          },
          virtual_links: eventFormat === EVENT_FORMAT.VIRTUAL || eventFormat === EVENT_FORMAT.HYBRID
            ? { meeting_url: values.virtualUrl || "" }
            : {},
        },
        access_control: {
          require_rsvp: values.requireRsvp || false,
          view_details: values.detailViewMode || DETAIL_VIEW_MODE.BEFORE,
        },
        cancellation_policy: {
          allowed: values.cancellationAllowed || false,
          refund_strategy: values.refundStrategy || REFUND_STRATEGY.NONE,
          refund_percentage: values.refundPercentage,
          tiered_refunds: values.tieredRefunds || [],
        },
        billing_info: values.billingAddress ? {
          street: values.billingAddress,
          city: values.billingCity || "",
          state: values.billingState || "",
          postal_code: values.billingPostalCode || "",
          country: values.billingCountry || "",
        } : undefined,
        terms_and_conditions: values.termsAndConditions ? [values.termsAndConditions] : [],
      }

      // const jsonData = JSON.stringify(eventData, null, 2)
      // const blob = new Blob([jsonData], { type: "application/json" })
      // const url = URL.createObjectURL(blob)
      // const a = document.createElement("a")
      // a.href = url
      // a.download = "eventdata.json"
      // a.click()
      // URL.revokeObjectURL(url)

      setSavedEventStatus(eventStatus)
      setShowSuccessModal(true)
    } catch (error) {
      message.error("Failed to create event")
    }
  }

  const collapseItems = [
    {
      key: "1",
      label: (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-blue-600" />
          <span className="font-medium">Basic Information</span>
          <span className="text-red-500 font-bold">*</span>
          <div className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded font-medium">
            REQUIRED
          </div>
        </div>
      ),
      className: "border-l-4 border-l-red-500",
      children: (
        <BasicInfoCollapse
          form={form}
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          description={description}
          setDescription={setDescription}
        />
      ),
    },
    {
      key: "2",
      label: (
        <div className="flex items-center gap-2">
          <EnvironmentOutlined className="text-blue-600" />
          <span className="font-medium">Location & Format</span>
          <span className="text-red-500 font-bold">*</span>
          <div className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded font-medium">
            REQUIRED
          </div>
        </div>
      ),
      className: "border-l-4 border-l-red-500",
      children: (
        <LocationCollapse
          eventFormat={eventFormat}
          setEventFormat={setEventFormat}
        />
      ),
    },
    {
      key: "3",
      label: (
        <div className="flex items-center gap-2">
          <DollarOutlined className="text-blue-600" />
          <span>Pricing & Refunds</span>
        </div>
      ),
      children: (
        <PricingCollapse
          eventType={eventType}
          setEventType={setEventType}
          formValues={formValues}
        />
      ),
    },
    {
      key: "4",
      label: (
        <div className="flex items-center gap-2">
          <SettingOutlined className="text-blue-600" />
          <span>Cancellation Policy</span>
        </div>
      ),
      children: (
        <CancellationPolicyCollapse
          formValues={formValues}
        />
      ),
    },
    {
      key: "5",
      label: (
        <div className="flex items-center gap-2">
          <SettingOutlined className="text-blue-600" />
          <span>Advanced Options</span>
        </div>
      ),
      children: (
        <AdvancedCollapse
          formValues={formValues}
          tags={tags}
          setTags={setTags}
          sponsors={sponsors}
          setSponsors={setSponsors}
          eventImages={eventImages}
          setEventImages={setEventImages}
        />
      ),
    },
  ]

  return (
    <div className=" bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Title level={2} className="mb-2 text-gray-800">
              Create an Event
            </Title>
            <Text type="secondary" className="text-base">
              Fill in the required sections to create your event
            </Text>
          </div>
          <div className="flex gap-3">
            <Button 
              type="default" 
              size="large" 
              className="px-6"
              disabled={!hasAnyContent}
              onClick={() => {
                if (!hasAnyContent) {
                  message.warning('Add some content to save as draft')
                  return
                }
                handleSave(EVENT_STATUS.DRAFT)
              }}
            >
              Save as Draft
            </Button>
            <Button 
              type="primary" 
              size="large" 
              className="px-6 shadow-lg"
              disabled={!canSave}
              onClick={() => {
                if (!canSave) {
                  message.error('Please fill required sections (Basic Information & Location) to publish event')
                  return
                }
                setShowPublishModal(true)
              }}
            >
              Publish Event
            </Button>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleFormChange}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={14}>
              <Collapse
                items={collapseItems}
                defaultActiveKey={["1"]}
                className="shadow-sm"
                size="large"
              />
              
              {!canSave && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <Text className="text-sm text-red-700 font-medium">
                    ⚠️ Complete the highlighted REQUIRED sections to publish your event
                  </Text>
                  <div className="mt-2 text-xs text-red-600">
                    • Basic Information: Title, Date, Start/End Time
                    • Location: Event format and location details
                  </div>
                </div>
              )}
            </Col>

            <Col xs={24} lg={10}>
              <LivePreview
                formValues={formValues}
                coverImage={coverImage}
                description={description}
                tags={tags}
                sponsors={sponsors}
                eventFormat={eventFormat}
                eventType={eventType}
                eventImages={eventImages}
              />
            </Col>
          </Row>
        </Form>
        
        <PublishConfirmModal
          visible={showPublishModal}
          onConfirm={() => {
            setShowPublishModal(false)
            handleSave(EVENT_STATUS.PUBLISHED)
          }}
          onCancel={() => {
            setShowPublishModal(false)
            handleSave(EVENT_STATUS.DRAFT)
          }}
          eventTitle={formValues.title || 'Untitled Event'}
        />
        
        <SaveSuccessModal
          visible={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          eventTitle={formValues.title || 'Untitled Event'}
          eventStatus={savedEventStatus}
        />
      </div>
    </div>
  )
}