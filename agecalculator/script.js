function calculateAge() {
    const birthDate = new Date(document.getElementById('birth-date').value);
    const today = new Date();
    
    if (birthDate > today) {
        alert('Birth date cannot be in the future!');
        return;
    }
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // If birth month is after current month OR 
    // birth month is current month but birth day is after current day
    if (months < 0 || (months === 0 && days < 0)) {
        years--;
        months += 12;
    }

    // Adjust days
    if (days < 0) {
        const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, birthDate.getDate());
        days = Math.floor((today - prevMonth) / (1000 * 60 * 60 * 24));
        months--;
    }

    // Update the display
    document.getElementById('years').textContent = years;
    document.getElementById('months').textContent = months;
    document.getElementById('days').textContent = days;
}

// Set max date to today
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const maxDate = `${yyyy}-${mm}-${dd}`;
    document.getElementById('birth-date').max = maxDate;
});
