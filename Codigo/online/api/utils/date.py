from datetime import datetime
import re


def check_date_format(date_str):
    # Expresión regular para el formato x-y-z
    pattern = r'^([1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(18\d{2}|19\d{2}|20\d{2})$'
    
    # Verificar si la cadena cumple con el formato de fecha
    if re.match(pattern, date_str):
        return True
    else:
        return False

def check_schedule_format(data_str):
    time_format = r'^([01][0-9]|2[0-4]):([0-5][0-9])$'
    for field in ['openTime', 'closeTime']:
        if  re.match(time_format, data_str):
            return True
        else:
            return False

def createDate():
    return datetime.now().strftime('%Y-%m-%d %H:%M')