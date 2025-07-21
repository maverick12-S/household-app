import { Box, Button } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { addMonths } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useAppContext } from '../context/AppContext';

function MonthSelector() {
    const {currentMonth,setCurrentMonth} = useAppContext();
    const handleDateChange = (newDate: Date | null) => {
        if(newDate){
            setCurrentMonth(newDate);
        }
    }
    const handlePreviousMonth = () => {
        const previousMonth = addMonths(currentMonth, -1);
        setCurrentMonth(previousMonth);
    }
    const handleNextMonth = () => {
        const nextMonth = addMonths(currentMonth, 1);
        setCurrentMonth(nextMonth);
    }
  return (
    <LocalizationProvider
    dateAdapter={AdapterDateFns}
    adapterLocale={ja}
    dateFormats={{ monthAndYear: "yyyy年MM月"}}
    >
    <Box sx={{display: "flex", justifyContent:"center", alignItems: "center"}}>
        <Button 
        color={"error"} 
        variant="contained"
        onClick={handlePreviousMonth}
        >
            先月
        </Button>
            <DatePicker
            label="年月を選択"
            value = {currentMonth}
            sx={{ mx: 2, background: "white"}}
            views={["year","month"]}
            format="yyyy/MM"
            slotProps={{
                toolbar: {
                    toolbarFormat: "yyyy/MM",
                }
            }}
            onChange={handleDateChange}
            />
        <Button
        color={"primary"}
        variant="contained"
        onClick={handleNextMonth}
        >
            次月
        </Button>
    </Box>
    </LocalizationProvider>
  );
};

export default MonthSelector