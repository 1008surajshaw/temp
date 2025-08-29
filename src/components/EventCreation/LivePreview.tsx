import { Card, Tag, Avatar, Typography, Divider } from "antd"
import { CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined, UserOutlined, DollarOutlined } from "@ant-design/icons"
import { EVENT_FORMAT, EVENT_VISIBILITY, EVENT_TYPE } from "../../types"
import type { UploadFile } from "antd/es/upload/interface"

const { Text, Title } = Typography

interface Sponsor {
  name: string
  image?: string
}

interface LivePreviewProps {
  formValues: any
  coverImage: UploadFile[]
  description: string
  tags: string[]
  sponsors: Sponsor[]
  eventFormat: EVENT_FORMAT
  eventType: EVENT_TYPE
  eventImages: UploadFile[]
}

export default function LivePreview({
  formValues,
  coverImage,
  description,
  tags,
  sponsors,
  eventFormat,
  eventType,
  eventImages
}: LivePreviewProps) {
  return (
    <Card
      title="Live Preview"
      className="sticky top-6 shadow-lg"
      bodyStyle={{ padding: "20px" }}
    >
      <div className="space-y-6">
        {/* Cover Image */}
        <div className="relative">
          {coverImage.length > 0 ? (
            <img
              src={coverImage[0].url || coverImage[0].thumbUrl}
              alt="Event Cover"
              className="w-full h-48 object-cover rounded-lg shadow-sm"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Text className="text-white text-xl font-semibold">
                {formValues.title || 'Your Event Title'}
              </Text>
            </div>
          )}
        </div>

        {/* Event Title & Visibility */}
        <div>
          <Title level={3} className="mb-2">
            {formValues.title || 'Untitled Event'}
          </Title>
          <div className="flex items-center gap-2 mb-3">
            {formValues.visibility && (
              <Tag color={formValues.visibility === EVENT_VISIBILITY.PUBLIC ? "green" : "orange"}>
                {formValues.visibility === EVENT_VISIBILITY.PUBLIC ? '🌍 Public' : '🔒 Private'}
              </Tag>
            )}
            {formValues.category && (
              <Tag color="blue">{formValues.category}</Tag>
            )}
          </div>
        </div>

        {/* Description */}
        {(description || formValues.description) && (
          <div>
            <Text className="text-gray-700 leading-relaxed">
              <div
                dangerouslySetInnerHTML={{
                  __html: (description || formValues.description).length > 200
                    ? `${(description || formValues.description).substring(0, 200)}...`
                    : description || formValues.description,
                }}
              />
            </Text>
          </div>
        )}         

        <Divider />

        {/* Date & Time */}
        <div className="flex items-start gap-3">
          <CalendarOutlined className="text-blue-600 text-lg mt-1" />
          <div>
            <Text strong className="block mb-1">When</Text>
            {formValues.eventDate ? (
              <div className="space-y-1">
                <Text className="block">{formValues.eventDate.format("dddd, MMMM DD, YYYY")}</Text>
                {formValues.startTime && formValues.endTime && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <ClockCircleOutlined className="text-sm" />
                    <Text>{formValues.startTime.format("h:mm A")} - {formValues.endTime.format("h:mm A")}</Text>
                    {formValues.timezone && formValues.timezone !== "UTC" && (
                      <Text type="secondary">({formValues.timezone.split("/")[1]?.replace("_", " ")})</Text>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Text type="secondary">Date and time to be announced</Text>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-3">
          <div className="w-full">
            <div className="flex justify-between">
              <Text strong className="block mb-1 ">Where</Text>
              <Tag color={eventFormat === EVENT_FORMAT.VIRTUAL ? "purple" : eventFormat === EVENT_FORMAT.HYBRID ? "orange" : "green"}>
                {eventFormat} Event
              </Tag>
            </div>
            
            {(eventFormat === EVENT_FORMAT.PHYSICAL || eventFormat === EVENT_FORMAT.HYBRID) && (
              <div className="mt-2">
                {formValues.venue && <Text strong className="block">{formValues.venue}</Text>}
                {(formValues.address || formValues.city) && (
                  <Text className="text-gray-600">
                    {[formValues.address, formValues.city, formValues.state].filter(Boolean).join(", ")}
                  </Text>
                )}
              </div>
            )}
            
            {formValues.virtualUrl && (eventFormat === EVENT_FORMAT.VIRTUAL || eventFormat === EVENT_FORMAT.HYBRID) && (
              <Text className="text-blue-600 block mt-1">🔗 Online meeting link will be provided</Text>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-start gap-3">
          <DollarOutlined className="text-blue-600 text-lg mt-1" />
          <div>
            <Text strong className="block mb-1">Pricing</Text>
            {eventType === EVENT_TYPE.PAID ? (
              <div>
                {formValues.price ? (
                  <Text strong className="text-lg text-green-600">${formValues.price}</Text>
                ) : (
                  <Tag color="blue">Paid Event</Tag>
                )}
                {formValues.capacity && (
                  <Text type="secondary" className="block text-sm">
                    {formValues.capacity} tickets available
                  </Text>
                )}
              </div>
            ) : (
              <div>
                <Tag color="green">FREE</Tag>
                {formValues.registrationLimit && (
                  <Text type="secondary" className="block text-sm">
                    Limited to {formValues.registrationLimit} attendees
                  </Text>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Registration Period */}
        {(formValues.registrationStartDate || formValues.registrationEndDate) && (
          <div className="flex items-start gap-3">
            <UserOutlined className="text-blue-600 text-lg mt-1" />
            <div>
              <Text strong className="block mb-1">Registration</Text>
              <div className="space-y-1 text-sm text-gray-600">
                {formValues.registrationStartDate && (
                  <div>Opens: {formValues.registrationStartDate.format("MMM DD, YYYY")}</div>
                )}
                {formValues.registrationEndDate && (
                  <div>Closes: {formValues.registrationEndDate.format("MMM DD, YYYY")}</div>
                )}
              </div>
            </div>
          </div>
        )}

       
        {/* Sponsors */}
        {sponsors.length > 0 && (
          <div>
            <Text strong className="block mb-2">Sponsored by</Text>
            <div className="flex flex-wrap gap-2">
              {sponsors.map((sponsor, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  {sponsor.image ? (
                    <Avatar size="small" src={sponsor.image} />
                  ) : (
                    <Avatar size="small" style={{ backgroundColor: "#1890ff" }}>
                      {sponsor.name.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                  <Text className="text-sm font-medium">{sponsor.name}</Text>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event Images */}
        {eventImages.length > 0 && (
          <div>
            <Text strong className="block mb-2">Event Gallery</Text>
            <div className="grid grid-cols-2 gap-2">
              {eventImages.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={image.url || image.thumbUrl}
                  alt={`Event ${index + 1}`}
                  className="w-full h-20 object-cover rounded"
                />
              ))}
              {eventImages.length > 4 && (
                <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center">
                  <Text className="text-gray-500 text-sm">+{eventImages.length - 4} more</Text>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cancellation Policy */}
        {formValues.cancellationAllowed && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <Text strong className="block mb-1">Cancellation Policy</Text>
            <Text className="text-sm text-gray-600">
              {formValues.refundStrategy === 'full_refund' && 'Full refund available'}
              {formValues.refundStrategy === 'partial_refund' && `${formValues.refundPercentage || 50}% refund available`}
              {formValues.refundStrategy === 'no_refund' && 'No refunds available'}
              {formValues.refundStrategy === 'tiered_refund' && 'Tiered refund policy applies'}
            </Text>
          </div>
        )}

        {/* Terms & Conditions */}
        {formValues.termsAndConditions && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <Text strong className="block mb-1">Terms & Conditions</Text>
            <Text className="text-sm text-gray-600">
              {formValues.termsAndConditions.length > 100
                ? `${formValues.termsAndConditions.substring(0, 100)}...`
                : formValues.termsAndConditions}
            </Text>
          </div>
        )}
      </div>
    </Card>
  )
}