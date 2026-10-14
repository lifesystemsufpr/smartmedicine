import DateTimePicker from '@expo/ui/community/datetime-picker';
import * as Notifications from "expo-notifications"
import { useState } from "react"
import { Alert, Button, View } from "react-native"

export default function TimePicker() {
  const [date, setDate] = useState(new Date())
  const [show, setShow] = useState(false)

  async function scheduleAlarm(date: Date, timesPerDay: number): Promise<void> {
    const startHour = date.getHours()
    const startMinute = date.getMinutes()
    const everyNHours = 24 / timesPerDay

    for (let i = 0; i < timesPerDay; i++) {
      const offSet = everyNHours * i
      const scheduledHour = (startHour + offSet) % 24
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "TimePicker",
          body: "Remédio!!!",
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: scheduledHour,
          minute: startMinute,
          channelId: "alarm-channel", // Canal do android
        },
      })
    }

    const formattedTime = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`
    Alert.alert(
      "Alarme Configurado!",
      `O alarme começará às ${formattedTime} e tocará a cada ${everyNHours} horas todos os dias.`,
    )
  }

  return (
    <View>
      <Button title="Escolha um horário" onPress={() => setShow(true)} />
      {show && (
        <DateTimePicker
          accentColor="green"
          value={date}
          //   No final provavelmente vai ser assim e ai passa para a função quando enviar o form
          //   onValueChange={(event, selectedDate) => {
          //     setDate(selectedDate)
          //   }}
          onValueChange={(event, selectedDate) => {
            setShow(false)
            setDate(date)
            //TODO: 3 adicionar um radiobox para a pessoa escolher a quantidade de vezes por dia
            scheduleAlarm(selectedDate, 3)
          }}
          onDismiss={() => {
            setShow(false)
          }}
          mode="time"
          presentation="dialog"
        />
      )}
      <Button title="Cancelar notificações" onPress={()=> Notifications.cancelAllScheduledNotificationsAsync()}/>
    </View>
  )
}
