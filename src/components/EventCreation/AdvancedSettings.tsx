import { Form, Switch, Select, InputNumber, Card, Typography } from "antd"
import { useState } from "react"
import { SCHEDULE_MODE, RECURRENCE_PATTERN, REFUND_STRATEGY } from "../../types"

const { Option } = Select
const { Text } = Typography

interface AdvancedSettingsProps {
  formValues: any
}

export default function AdvancedSettings({ formValues }: AdvancedSettingsProps) {
  const [enableScheduleMode, setEnableScheduleMode] = useState(false)
  const [enableRecurrence, setEnableRecurrence] = useState(false)
  const [enableRefundStrategy, setEnableRefundStrategy] = useState(false)

  return (
    <div className="space-y-6">
      <Card title="Advanced Settings" size="small">
        <div className="space-y-4">
          {/* Schedule Mode */}
          <div className="flex items-center justify-between">
            <div>
              <Text strong>Schedule Mode</Text>
              <div className="text-sm text-gray-500">Configure event scheduling</div>
            </div>
            <Switch checked={enableScheduleMode} onChange={setEnableScheduleMode} />
          </div>
          
          {enableScheduleMode && (
            <Form.Item name="scheduleMode" label="Schedule Mode">
              <Select placeholder="Select schedule mode">
                <Option value={SCHEDULE_MODE.SINGLE}>Single Event</Option>
                <Option value={SCHEDULE_MODE.MULTI}>Multi-day Event</Option>
                <Option value={SCHEDULE_MODE.RECURRING}>Recurring Event</Option>
              </Select>
            </Form.Item>
          )}

          {/* Recurrence Pattern */}
          <div className="flex items-center justify-between">
            <div>
              <Text strong>Recurrence Pattern</Text>
              <div className="text-sm text-gray-500">Set recurring schedule</div>
            </div>
            <Switch checked={enableRecurrence} onChange={setEnableRecurrence} />
          </div>
          
          {enableRecurrence && (
            <div className="space-y-4">
              <Form.Item name="recurrencePattern" label="Pattern">
                <Select placeholder="Select pattern">
                  <Option value={RECURRENCE_PATTERN.DAILY}>Daily</Option>
                  <Option value={RECURRENCE_PATTERN.WEEKLY}>Weekly</Option>
                  <Option value={RECURRENCE_PATTERN.MONTHLY}>Monthly</Option>
                </Select>
              </Form.Item>
              
              <Form.Item name="recurrenceInterval" label="Interval">
                <InputNumber min={1} placeholder="1" className="w-full" />
              </Form.Item>
              
              <Form.Item name="maxOccurrences" label="Max Occurrences">
                <InputNumber min={1} placeholder="10" className="w-full" />
              </Form.Item>
            </div>
          )}

          {/* Refund Strategy */}
          <div className="flex items-center justify-between">
            <div>
              <Text strong>Refund Strategy</Text>
              <div className="text-sm text-gray-500">Configure refund policy</div>
            </div>
            <Switch checked={enableRefundStrategy} onChange={setEnableRefundStrategy} />
          </div>
          
          {enableRefundStrategy && (
            <div className="space-y-4">
              <Form.Item name="refundStrategy" label="Refund Policy">
                <Select placeholder="Select refund policy">
                  <Option value={REFUND_STRATEGY.FULL}>Full Refund</Option>
                  <Option value={REFUND_STRATEGY.PARTIAL}>Partial Refund</Option>
                  <Option value={REFUND_STRATEGY.NONE}>No Refund</Option>
                </Select>
              </Form.Item>
              
              {formValues.refundStrategy === REFUND_STRATEGY.PARTIAL && (
                <Form.Item name="refundPercentage" label="Refund Percentage">
                  <InputNumber
                    min={0}
                    max={100}
                    formatter={(value) => `${value}%`}
                    parser={(value) => parseInt(value!.replace("%", "")) as any}
                    className="w-full"
                  />
                </Form.Item>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}