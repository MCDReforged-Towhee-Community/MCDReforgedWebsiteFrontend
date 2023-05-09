export default function useEventListener(target: EventTarget, type: string, callback: EventListenerOrEventListenerObject | null) {
  onMounted(() => target.addEventListener(type, callback));
  onUnmounted(() => target.removeEventListener(type, callback));
}
