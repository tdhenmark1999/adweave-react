import axios from "axios";

export const requestTimezone = async () => await axios.get('https://worldtimeapi.org/api/timezone');